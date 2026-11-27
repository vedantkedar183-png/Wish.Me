/**
 * "Love Me Like You Do" — instrumental player.
 *
 * The notes come from a full-length solo-piano transcription of the actual
 * song (see `loveMeLikeYouDoScore.js`): intro, both verses, the pre-chorus,
 * every chorus, the bridge and the outro, looping when it reaches the end.
 *
 * Everything is synthesized live with the Web Audio API, so there is no audio
 * file to download and nothing that can 404 on a friend's phone.
 *
 * Mobile notes
 * ────────────
 * Phones get a lighter version of the same arrangement:
 *   • four oscillator partials instead of five
 *   • two short feedback-delay taps instead of a convolution reverb
 *     (building the reverb impulse was the main cause of the first-tap freeze)
 *   • a longer scheduler tick, so the main thread wakes up less often
 *   • a catch-up jump if the tab slept, so returning to the page never plays
 *     a burst of late notes
 *
 * The AudioContext is created and resumed inside the tap that starts the song.
 * `start()` resolves only once the context is actually RUNNING, so the button
 * can tell the truth when a browser blocks audio. iOS silent-switch audio is
 * requested through the Audio Session API where it exists.
 */

import { BPM, NOTES, TOTAL_BEATS } from './loveMeLikeYouDoScore';
import { getDeviceProfile } from '../utils/device';

const SECONDS_PER_BEAT = 60 / BPM;
const LOOP_SECONDS = TOTAL_BEATS * SECONDS_PER_BEAT;

const TICK_DESKTOP = 120;
const TICK_MOBILE = 200;
const LOOK_AHEAD_DESKTOP = 1.2;
const LOOK_AHEAD_MOBILE = 1.8;

// ─── Piano voice ─────────────────────────────────────────────────────────────
const midiToHz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

const FULL_PARTIALS = [
  { type: 'sine', ratio: 1, gain: 0.5, detune: -2.5 },
  { type: 'sine', ratio: 1.0015, gain: 0.26, detune: 2.5 },
  { type: 'sine', ratio: 2, gain: 0.15, detune: 1 },
  { type: 'sine', ratio: 3, gain: 0.055, detune: -1.5 },
  { type: 'sine', ratio: 4.01, gain: 0.022, detune: 2 },
];

// Four partials keep the fundamental and the first two harmonics — that is
// where a piano's warmth lives — for about half the oscillator cost.
const LITE_PARTIALS = [
  { type: 'sine', ratio: 1, gain: 0.54, detune: -2 },
  { type: 'triangle', ratio: 1, gain: 0.075, detune: 3 },
  { type: 'sine', ratio: 2, gain: 0.155, detune: 1 },
  { type: 'sine', ratio: 3, gain: 0.05, detune: -1 },
];

function createNoiseBuffer(context) {
  const length = Math.floor(context.sampleRate * 0.08);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
  }
  return buffer;
}

function createReverb(context) {
  const length = Math.floor(context.sampleRate * 2.4);
  const impulse = context.createBuffer(2, length, context.sampleRate);

  // A handful of distinct early reflections make the tail read as a real
  // room instead of a wash of noise. Values are in seconds.
  const early = [
    { t: 0.011, g: 0.34 },
    { t: 0.019, g: 0.26 },
    { t: 0.031, g: 0.2 },
    { t: 0.047, g: 0.15 },
    { t: 0.071, g: 0.11 },
  ];

  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      const progress = i / length;
      data[i] = (Math.random() * 2 - 1) * (1 - progress) ** 2.6;
    }
    early.forEach((tap, index) => {
      const offset = Math.floor((tap.t + channel * 0.0023 + index * 0.0004) * context.sampleRate);
      if (offset < length) data[offset] += tap.g * (channel === 0 ? 1 : 0.82);
    });
  }

  const convolver = context.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

/**
 * Two short feedback-delay taps: a cheap stereo room that is almost free on a
 * phone. A mono single tap sounded flat and metallic, so each tap gets its own
 * damped feedback path and a little pan.
 */
function createLiteReverb(context) {
  const input = context.createGain();
  const wet = context.createGain();
  wet.gain.value = 0.2;

  const taps = [
    { time: 0.17, feedback: 0.22, pan: -0.4, level: 0.95 },
    { time: 0.29, feedback: 0.16, pan: 0.4, level: 0.7 },
  ];

  taps.forEach((tap) => {
    const delay = context.createDelay(0.6);
    delay.delayTime.value = tap.time;

    const tone = context.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 3000;

    const feedback = context.createGain();
    feedback.gain.value = tap.feedback;

    const level = context.createGain();
    level.gain.value = tap.level;

    input.connect(delay);
    delay.connect(tone);
    tone.connect(level);
    tone.connect(feedback);
    feedback.connect(delay);

    if (context.createStereoPanner) {
      const pan = context.createStereoPanner();
      pan.pan.value = tap.pan;
      level.connect(pan);
      pan.connect(wet);
    } else {
      level.connect(wet);
    }
  });

  return { input, output: wet };
}

function velocityFor(midi) {
  if (midi < 46) return 0.27;
  if (midi < 55) return 0.24;
  if (midi < 64) return 0.22;
  if (midi < 72) return 0.205;
  if (midi < 80) return 0.19;
  return 0.175;
}

function playPianoNote(context, busses, note, when, noiseBuffer, partials) {
  const { midi } = note;
  const duration = Math.max(note.duration * SECONDS_PER_BEAT, 0.16);
  const freq = midiToHz(midi);
  const end = when + duration;
  const peak = velocityFor(midi);

  // A piano note does not hold: it blooms, then keeps decaying even while the
  // key is down. The extra sustain stage keeps long chord notes from sounding
  // like an organ without cutting them short.
  const envelope = context.createGain();
  const sustainAt = Math.max(when + 0.3, Math.min(end, when + 1.5));
  const releaseAt = Math.max(end, sustainAt + 0.05);

  envelope.gain.setValueAtTime(0.0001, when);
  envelope.gain.exponentialRampToValueAtTime(peak, when + 0.006);
  envelope.gain.exponentialRampToValueAtTime(peak * 0.44, when + 0.24);
  envelope.gain.exponentialRampToValueAtTime(peak * 0.19, sustainAt);
  envelope.gain.exponentialRampToValueAtTime(0.0001, releaseAt + 0.6);

  const toneFilter = context.createBiquadFilter();
  toneFilter.type = 'lowpass';
  toneFilter.Q.value = 0.4;
  toneFilter.frequency.setValueAtTime(Math.min(11000, freq * 9 + 1100), when);
  toneFilter.frequency.exponentialRampToValueAtTime(
    Math.max(750, freq * 2.8 + 420),
    when + 0.95,
  );
  toneFilter.connect(envelope);

  // Register-aware stereo: bass sits near the centre, the melody opens up.
  const pan = context.createStereoPanner ? context.createStereoPanner() : null;
  if (pan) {
    pan.pan.value = Math.max(-0.3, Math.min(0.3, (midi - 61) / 90));
    envelope.connect(pan);
  }

  partials.forEach((partial) => {
    const osc = context.createOscillator();
    osc.type = partial.type;
    osc.frequency.value = freq * partial.ratio;
    osc.detune.value = partial.detune;
    const voiceGain = context.createGain();
    voiceGain.gain.value = partial.gain;
    osc.connect(voiceGain);
    voiceGain.connect(toneFilter);
    osc.start(when);
    osc.stop(releaseAt + 0.8);
  });

  if (noiseBuffer) {
    const hammer = context.createBufferSource();
    hammer.buffer = noiseBuffer;
    const hammerFilter = context.createBiquadFilter();
    hammerFilter.type = 'bandpass';
    hammerFilter.frequency.value = Math.min(4200, freq * 4.5);
    hammerFilter.Q.value = 0.8;
    const hammerGain = context.createGain();
    hammerGain.gain.setValueAtTime(Math.max(0.0002, peak * 0.12), when);
    hammerGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.055);
    hammer.connect(hammerFilter);
    hammerFilter.connect(hammerGain);
    hammerGain.connect(envelope);
    hammer.start(when);
    hammer.stop(when + 0.08);
  }

  const output = pan || envelope;
  output.connect(busses.dry);
  output.connect(busses.wet);
}

// ─── Player ──────────────────────────────────────────────────────────────────
const EVENTS = NOTES.slice().sort((a, b) => a.beat - b.beat);

let context = null;
let master = null;
let busses = null;
let noiseBuffer = null;
let timer = null;
let stopTimer = null;
let fadingMaster = null;
let loopStart = 0;
let nextEvent = 0;
let active = false;
let starting = null;
let partials = FULL_PARTIALS;
let tickMs = TICK_DESKTOP;
let lookAhead = LOOK_AHEAD_DESKTOP;
let visibilityHandler = null;

function tick() {
  if (!context || !busses) return;

  // If the tab slept or the phone froze the timer, jump to the present instead
  // of racing through hundreds of overdue notes.
  if (context.currentTime - loopStart > LOOP_SECONDS * 1.25) {
    loopStart = context.currentTime + 0.12;
    nextEvent = 0;
  }

  const horizon = context.currentTime + lookAhead;
  let guard = 0;

  while (guard < EVENTS.length * 2) {
    guard += 1;

    if (nextEvent >= EVENTS.length) {
      loopStart += LOOP_SECONDS;
      nextEvent = 0;
    }

    const note = EVENTS[nextEvent];
    const when = loopStart + note.beat * SECONDS_PER_BEAT;

    if (when >= horizon) break;

    // If a background tab stalled us past a note, skip it instead of
    // dumping a burst of late notes into the present.
    if (when >= context.currentTime - 0.03) {
      playPianoNote(context, busses, note, when, noiseBuffer, partials);
    }
    nextEvent += 1;
  }
}

function ensureContext() {
  if (context) return context;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  try {
    // `latencyHint: 'playback'` is friendlier to low-end phones than 'interactive'.
    context = new AudioCtx({ latencyHint: 'playback' });
  } catch {
    try {
      context = new AudioCtx();
    } catch {
      return null;
    }
  }

  // Ask iOS to treat this as media playback, so the ring/silent switch does
  // not silently swallow the song on newer Safari versions.
  try {
    if (navigator.audioSession) navigator.audioSession.type = 'playback';
  } catch {
    // Audio Session API is optional.
  }

  if (typeof document !== 'undefined') {
    visibilityHandler = () => {
      if (!active || !context) return;
      if (document.visibilityState === 'visible' && context.state === 'suspended') {
        context.resume().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', visibilityHandler);
  }

  return context;
}

function buildGraph() {
  const profile = getDeviceProfile();
  const lite = profile.reduceAmbient;

  partials = lite ? LITE_PARTIALS : FULL_PARTIALS;
  tickMs = lite ? TICK_MOBILE : TICK_DESKTOP;
  lookAhead = lite ? LOOK_AHEAD_MOBILE : LOOK_AHEAD_DESKTOP;

  master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.82, context.currentTime + 1.4);

  // Trim sub-bass rumble phones cannot reproduce anyway, then keep peaks in
  // check with a gentle compressor so chords never clip.
  const highpass = context.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 30;
  highpass.Q.value = 0.6;

  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -15;
  compressor.knee.value = 22;
  compressor.ratio.value = 3.2;
  compressor.attack.value = 0.005;
  compressor.release.value = 0.22;

  master.connect(highpass);
  highpass.connect(compressor);
  compressor.connect(context.destination);

  const dry = context.createGain();
  dry.gain.value = 0.92;
  dry.connect(master);

  let wetInput;
  if (lite) {
    const liteReverb = createLiteReverb(context);
    wetInput = liteReverb.input;
    liteReverb.output.connect(master);
  } else {
    const convolver = createReverb(context);
    const wet = context.createGain();
    wet.gain.value = 0.26;
    const reverbTone = context.createBiquadFilter();
    reverbTone.type = 'lowpass';
    reverbTone.frequency.value = 4200;
    convolver.connect(reverbTone);
    reverbTone.connect(wet);
    wet.connect(master);
    wetInput = convolver;
  }

  busses = { dry, wet: wetInput };
  noiseBuffer = createNoiseBuffer(context);
}

export const pianoPlayer = {
  /**
   * Resolves to `true` only when sound is actually allowed and scheduled.
   * Always call this from a real user gesture (tap / key press).
   */
  async start() {
    if (active) {
      if (context && context.state !== 'running') {
        try {
          await context.resume();
        } catch {
          return false;
        }
      }
      return Boolean(context && context.state === 'running');
    }

    if (starting) return starting;

    starting = (async () => {
      const ctx = ensureContext();
      if (!ctx) return false;

      try {
        await ctx.resume();
      } catch {
        return false;
      }

      if (ctx.state !== 'running') return false;

      if (stopTimer) {
        clearTimeout(stopTimer);
        stopTimer = null;
      }
      if (fadingMaster) {
        try {
          fadingMaster.disconnect();
        } catch {
          // Already disconnected.
        }
        fadingMaster = null;
      }

      buildGraph();

      loopStart = ctx.currentTime + 0.18;
      nextEvent = 0;
      active = true;

      tick();
      timer = setInterval(tick, tickMs);
      return true;
    })();

    try {
      return await starting;
    } finally {
      starting = null;
    }
  },

  stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    active = false;

    const closingContext = context;
    const closingMaster = master;

    if (closingContext && closingMaster) {
      try {
        closingMaster.gain.cancelScheduledValues(closingContext.currentTime);
        closingMaster.gain.setTargetAtTime(0.0001, closingContext.currentTime, 0.12);
      } catch {
        // The context may already be closed.
      }

      fadingMaster = closingMaster;
      stopTimer = setTimeout(() => {
        stopTimer = null;
        fadingMaster = null;
        try {
          closingMaster.disconnect();
        } catch {
          // Already disconnected.
        }
        // Keep the context around for the next play, but release the audio
        // hardware while paused. It is resumed inside the next tap.
        if (!active && closingContext.state === 'running') {
          closingContext.suspend().catch(() => {});
        }
      }, 360);
    }

    master = null;
    busses = null;
    noiseBuffer = null;
    loopStart = 0;
    nextEvent = 0;
  },

  isPlaying() {
    return Boolean(active && context && context.state === 'running');
  },

  /** Exposed for diagnostics; not used by the UI. */
  get state() {
    return context ? context.state : 'idle';
  },
};

export default pianoPlayer;
