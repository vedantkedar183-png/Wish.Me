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
 * A scheduler — rather than one giant up-front batch — keeps a ~1.2s
 * look-ahead window, which is gentle on low-end phones while still surviving
 * background-tab timer throttling.
 */

import { BPM, NOTES, TOTAL_BEATS } from './loveMeLikeYouDoScore';

const SECONDS_PER_BEAT = 60 / BPM;
const LOOP_SECONDS = TOTAL_BEATS * SECONDS_PER_BEAT;

const LOOK_AHEAD_SECONDS = 1.2;
const TICK_MS = 120;

// ─── Piano voice ─────────────────────────────────────────────────────────────
const midiToHz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

function createNoiseBuffer(ctx) {
  const length = Math.floor(ctx.sampleRate * 0.08);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
  }
  return buffer;
}

function createReverb(ctx) {
  const length = Math.floor(ctx.sampleRate * 2.8);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.8;
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

function velocityFor(midi) {
  if (midi < 46) return 0.24;
  if (midi < 55) return 0.21;
  if (midi < 64) return 0.19;
  if (midi < 72) return 0.18;
  return 0.16;
}

function playPianoNote(ctx, busses, note, when, noiseBuffer) {
  const { midi } = note;
  const duration = Math.max(note.duration * SECONDS_PER_BEAT, 0.16);
  const freq = midiToHz(midi);
  const end = when + duration;
  const peak = velocityFor(midi);

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, when);
  envelope.gain.exponentialRampToValueAtTime(peak, when + 0.007);
  envelope.gain.exponentialRampToValueAtTime(peak * 0.34, when + 0.24);
  envelope.gain.setValueAtTime(peak * 0.34, Math.max(when + 0.25, end));
  envelope.gain.exponentialRampToValueAtTime(0.0001, end + 0.55);

  const toneFilter = ctx.createBiquadFilter();
  toneFilter.type = 'lowpass';
  toneFilter.Q.value = 0.5;
  toneFilter.frequency.setValueAtTime(Math.min(9500, freq * 10 + 900), when);
  toneFilter.frequency.exponentialRampToValueAtTime(Math.max(700, freq * 3.4), when + 0.85);
  toneFilter.connect(envelope);

  // Register-aware stereo: bass sits near the centre, the melody opens up.
  const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  if (pan) {
    pan.pan.value = Math.max(-0.22, Math.min(0.22, (midi - 62) / 110));
    envelope.connect(pan);
  }

  const partials = [
    { type: 'sine', ratio: 1, gain: 0.58, detune: 0 },
    { type: 'triangle', ratio: 1, gain: 0.17, detune: 3 },
    { type: 'sine', ratio: 2, gain: 0.11, detune: -2 },
    { type: 'sine', ratio: 3, gain: 0.045, detune: 2 },
    { type: 'sine', ratio: 4.01, gain: 0.018, detune: 4 },
  ];

  partials.forEach((partial) => {
    const osc = ctx.createOscillator();
    osc.type = partial.type;
    osc.frequency.value = freq * partial.ratio;
    osc.detune.value = partial.detune;
    const voiceGain = ctx.createGain();
    voiceGain.gain.value = partial.gain;
    osc.connect(voiceGain);
    voiceGain.connect(toneFilter);
    osc.start(when);
    osc.stop(end + 0.7);
  });

  if (noiseBuffer) {
    const hammer = ctx.createBufferSource();
    hammer.buffer = noiseBuffer;
    const hammerFilter = ctx.createBiquadFilter();
    hammerFilter.type = 'bandpass';
    hammerFilter.frequency.value = Math.min(4200, freq * 4.5);
    hammerFilter.Q.value = 0.8;
    const hammerGain = ctx.createGain();
    hammerGain.gain.setValueAtTime(Math.max(0.0002, peak * 0.16), when);
    hammerGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.06);
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

let ctx = null;
let master = null;
let busses = null;
let noiseBuffer = null;
let timer = null;
let loopStart = 0;
let nextEvent = 0;
let active = false;
let onVisibility = null;

function tick() {
  if (!ctx || !busses) return;

  const horizon = ctx.currentTime + LOOK_AHEAD_SECONDS;
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
    if (when >= ctx.currentTime - 0.03) {
      playPianoNote(ctx, busses, note, when, noiseBuffer);
    }
    nextEvent += 1;
  }
}

function resumeContext() {
  if (!ctx || !active) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
}

export const pianoPlayer = {
  start() {
    if (active) return true;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    try {
      ctx = new AudioCtx();
    } catch {
      return false;
    }

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.55, ctx.currentTime + 2);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 26;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.006;
    compressor.release.value = 0.25;

    master.connect(compressor);
    compressor.connect(ctx.destination);

    const dry = ctx.createGain();
    dry.gain.value = 0.9;
    dry.connect(master);

    const reverb = createReverb(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.26;
    const reverbTone = ctx.createBiquadFilter();
    reverbTone.type = 'lowpass';
    reverbTone.frequency.value = 4200;
    reverb.connect(reverbTone);
    reverbTone.connect(wet);
    wet.connect(master);

    busses = { dry, wet: reverb };
    noiseBuffer = createNoiseBuffer(ctx);

    loopStart = ctx.currentTime + 0.14;
    nextEvent = 0;
    active = true;

    onVisibility = () => resumeContext();
    document.addEventListener('visibilitychange', onVisibility);

    tick();
    timer = setInterval(tick, TICK_MS);
    return true;
  },

  stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    active = false;

    if (onVisibility) {
      document.removeEventListener('visibilitychange', onVisibility);
      onVisibility = null;
    }

    if (ctx && master) {
      const closing = ctx;
      try {
        master.gain.cancelScheduledValues(closing.currentTime);
        master.gain.setTargetAtTime(0.0001, closing.currentTime, 0.12);
      } catch {
        // The context may already be closed.
      }
      setTimeout(() => {
        try {
          closing.close();
        } catch {
          // Already closed.
        }
      }, 380);
    }

    ctx = null;
    master = null;
    busses = null;
    noiseBuffer = null;
    loopStart = 0;
    nextEvent = 0;
  },

  isPlaying() {
    return active;
  },
};

export default pianoPlayer;
