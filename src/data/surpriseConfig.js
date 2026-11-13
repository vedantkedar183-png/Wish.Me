/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║         Wishora — Romantic Birthday Surprise Config              ║
 * ║                                                                  ║
 * ║  This is the ONLY file you need to edit to customise the         ║
 * ║  entire birthday experience. Change names, messages, photos,     ║
 * ║  reasons, the letter, and music right here.                      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import LOVE_ALPHABET from './loveAlphabet';

export const surpriseConfig = {

  // ─── PERSON DETAILS ────────────────────────────────────────────────
  person: {
    name: 'Sarah',               // Birthday person's name (shown prominently)
    age: 25,                     // Age they are turning
    birthdayDate: 'September 15, 2026',
    yourName: 'Vedant',          // Your name — used in the letter closing
  },

  // ─── SLIDE 1: WELCOME SCREEN ─────────────────────────────────────
  // Tone: Mysterious & enchanting — builds anticipation
  welcome: {
    preMessage: '🔮 A little secret has been waiting for you… 🔮',
    mainTitle: 'Something wonderful\nis waiting for you,',
    subtitle: 'A journey crafted with heart and soul',
    buttonText: 'Unwrap the Magic 🪄',
  },

  // ─── SLIDE 2: BIRTHDAY REVEAL ─────────────────────────────────────
  // Tone: Joyful & celebratory — the big surprise moment
  reveal: {
    topLine: 'The universe threw its finest confetti today,',
    bottomLine: 'because it was the day a star was born! 🌟',
    birthdayMessage:
      'If sunshine had a face, it would look like yours. You fill every room with warmth, every silence with laughter, and every heart with hope. This world hit the jackpot when you arrived. 🎇',
    continueText: "But wait \u2014 the best part is ahead 🚀",
  },

  // ─── SLIDE 3: MEMORIES GALLERY ────────────────────────────────────
  // Tone: Nostalgic & heartfelt — throwback vibes
  // HOW TO ADD YOUR OWN PHOTOS:
  //   1. Place your photos inside the  /public/photos/  folder
  //   2. Change each  src  to  '/photos/your-file-name.jpg'
  //   3. Adjust  rotation  (-5deg to 5deg) for the polaroid look
  memories: {
    title: 'A Scrapbook of Us',
    subtitle: 'Tiny frozen moments that mean the whole world 🗺️',
    photos: [
      { src: 'https://picsum.photos/seed/wsh1/360/440', caption: 'Where our story began 🌅',              rotation: '-3deg' },
      { src: 'https://picsum.photos/seed/wsh2/360/440', caption: 'Laughter that echoed for days 😂',       rotation:  '2deg' },
      { src: 'https://picsum.photos/seed/wsh3/360/440', caption: 'Golden hour, golden memories 🌻',        rotation: '-2deg' },
      { src: 'https://picsum.photos/seed/wsh4/360/440', caption: 'Adventures we never planned 🗺️',         rotation:  '3deg' },
      { src: 'https://picsum.photos/seed/wsh5/360/440', caption: 'Candid & perfectly imperfect 📷',        rotation: '-1deg' },
      { src: 'https://picsum.photos/seed/wsh6/360/440', caption: "The one I'd frame forever 🖼️",           rotation:  '2deg' },
    ],
  },

  // ─── SLIDE 4: UNDER THE SAME SKY ──────────────────────────────────
  // A hand-drawn night-sky scene (Parvati & Mahadev watching the stars).
  // Purely text-configurable; set `show: false` to remove the slide.
  divineSky: {
    show: true,
    title: 'Under the Same Sky',
    subtitle: 'Like Parvati & Mahadev, watching the stars',
    caption: 'Parvati & Mahadev, under the same stars',
    message:
      'Some bonds are written in the stars long before we meet \u2014 and under this same sky, I would choose you in every lifetime. \u2728',
    continueText: 'Keep going \u2764\ufe0f \u2192',
  },

  // ─── SLIDE 5: REASONS YOU'RE SPECIAL ──────────────────────────────
  // Tone: Warm & personal — specific personality-driven reasons
  reasons: {
    title: 'Reasons You’re Impossible to Forget',
    subtitle: 'Every little thing that makes you, you — and I notice all of them 💎✨',
    cards: [
      { icon: '🎭', text: 'Your dramatic storytelling that turns grocery trips into epic adventures'       },
      { icon: '🧲', text: 'That magnetic energy \u2014 people gravitate toward you without even realizing'  },
      { icon: '🍳', text: "The way you dance in the kitchen when you think nobody's watching"              },
      { icon: '🛡️', text: "Your fierce loyalty \u2014 you'd go to war for the people you love"              },
      { icon: '🔭', text: 'How you see possibility where others see dead ends'                             },
      { icon: '🎧', text: "Your impeccable taste in music \u2014 every playlist you make is chef's kiss"    },
      { icon: '🧩', text: 'The quirky little habits that make you unmistakably, uniquely you'              },
      { icon: '🌊', text: 'Your calm in the storm \u2014 an anchor for everyone around you'                },
    ],
  },

  // ─── SLIDE 5: A LITTLE LOVE GAME ──────────────────────────────────
  // A memory-matching mini game. Edit the emojis list (each one becomes a
  // pair), or remove the whole `game` block to hide the chapter.
  game: {
    title: 'A Little Game of Love',
    subtitle: 'Find every matching pair \u2014 two hearts that always find each other 🫶',
    hint: 'Tap two cards. Matching pairs stay open.',
    emojis: ['💖', '🌹', '🦋', '🎀', '🍓', '🌙', '⭐', '🧸'],
    winTitle: 'Perfect match!',
    winMessage: 'Every card found its other half \u2014 just like I found you. 💞',
    movesLabel: 'moves',
    pairsLabel: 'pairs',
    continueText: 'One last chapter 💌 \u2192',
    retryText: 'Play again 🔄',
    skipText: 'Skip for now \u2192',
  },

  // ─── OUR SONG: FULL-SCREEN LYRICS CHAPTER ─────────────────────────
  // A dedicated black stage that shows one line at a time in a big serif.
  // `lines` is a plain list — replace or extend it with your own words.
  // Set `show: false` to remove the whole chapter from the story.
  lyrics: {
    show: true,
    title: 'Love Me Like You Do',
    subtitle: 'our little song',
    hint: 'Tap the words for the next line',
    continueText: 'Continue our story \u2192',
    intervalMs: 7000,
    // 👇 Your lyric lines go here — one quoted line per entry. Paste as many
    //    as you like; the chapter shows them one at a time, in this order.
    lines: [
      'You light up every room you walk into',
      'Every love song sounds a little like you',
      'I\u2019d live this moment a thousand times',
      'You\u2019re the melody stuck in my head',
      'If forever had a face, it would be yours',
      'Ordinary days turn cinematic with you',
      'My favourite place is anywhere you are',
      'Dance with me in the kitchen, forever',
    ],
  },

  // ─── SLIDE 8: A HEART FULL OF YOU ─────────────────────────────────
  // A big glowing heart the reader taps to fill. Each tap pops a small heart
  // and lights the ring; fill it and confetti + a message unlock.
  heartGame: {
    show: true,
    title: 'A Heart Full of You',
    subtitle: 'One tap, one little piece of my heart \u2014 fill it up \ud83d\udc97',
    tapsLabel: 'taps',
    tapTarget: 10,
    prompts: [
      'Tap the heart\u2026',
      'Ooh, it glows brighter',
      'Halfway to my whole heart',
      'Almost bursting with love',
    ],
    winTitle: 'It\u2019s full \u2014 and it\u2019s all yours',
    winMessage:
      'Every tap was a little piece of my heart \u2014 and every piece has always belonged to you. \ud83d\udc9e',
    hint: 'Tap the heart \u2014 or press Space / Enter',
    continueText: 'Keep going \u2764\ufe0f \u2192',
    retryText: 'Fill it again \ud83d\udd04',
  },

  // ─── SLIDE 9: TWO PRINTS, ONE HEART ───────────────────────────────
  // The trending "two thumbprints make a heart" moment, made interactive:
  // each thumb starts faint — tap both to ink them in, then confetti + a note.
  thumbHeart: {
    show: true,
    title: 'Two Prints, One Heart',
    subtitle: 'Press both thumbs \u2014 that\u2019s us, you know \ud83d\udc97',
    hint: 'Tap both thumbprints',
    caption: 'Two prints, one heart \u2014 you & me',
    completeLabel: 'sealed with love',
    winTitle: 'Same heart, two prints',
    winMessage:
      'Different fingerprints, same heart \u2014 that\u2019s the whole story. \ud83d\udc97',
    continueText: 'One last chapter \ud83d\udc8c \u2192',
    retryText: 'Stamp again \ud83d\udd04',
  },

  // ─── SLIDE 10: THE A TO Z OF YOU ──────────────────────────────────
  // A keepsake book with one page per letter. `letters` lives in
  // src/data/loveAlphabet.js — edit the words and lines there.
  alphabet: {
    show: true,
    title: 'The A to Z of You',
    subtitle: 'Twenty-six little reasons, one for every letter',
    dedication:
      'Of all the stories ever told, my favourite is ours \u2014 the one where you walked in and my world quietly became home.',
    bookLabel: 'a little book of us',
    letterLabel: 'Letter',
    ofLabel: 'of',
    prevLabel: 'Previous letter',
    nextLabel: 'Next letter',
    signature: 'with love, always',
    hint: 'Turn the page, swipe, or tap a letter to begin anywhere',
    closingTitle: 'You are my whole alphabet',
    closingMessage:
      'Twenty-six letters, and every one of them spells you. I would read this book a hundred times and still find something new to love.',
    continueText: 'Keep going \u2764\ufe0f \u2192',
    letters: LOVE_ALPHABET,
  },

  // ─── SLIDE 5: LOVE LETTER ─────────────────────────────────────────
  // Tone: Intimate & poetic — a handwritten-feel confession
  letter: {
    title: "Words I've Been Saving",
    salutation: 'Dear Sarah \u2014 yes, you,',
    paragraphs: [
      "I've started writing this letter a hundred times in my head and erased it a hundred more. Not because I don't know what to say, but because no combination of twenty-six letters could ever capture what you are to me.",
      'You are the plot twist I never saw coming \u2014 the kind that rewrites the whole story for the better. Before you, my days had colour. After you, they had meaning.',
      "There are people who light up a room by walking in. And then there's you \u2014 who lights up a room just by existing somewhere in the same city. That's your superpower, and you wield it without even trying.",
      "So here's my birthday wish for you: may you feel, even for a second today, as remarkable as you make everyone else feel every single day. You are once-in-a-lifetime. Never forget that. 🕊️",
    ],
    closing: 'Turning these words into a promise,',
    signature: 'Forever in your corner 🤞',
  },

  // ─── SLIDE 6: FINAL BIRTHDAY SURPRISE ─────────────────────────────
  // Tone: Grand & cinematic — the epic finale
  final: {
    preText: 'The curtain rises on the grand finale…',
    mainWish: 'Happiest Birthday,',
    nameWish: 'Sarah! 🎀',
    ageText: 'A spectacular Chapter 25 begins 🥂',
    message:
      "May this new year of your life be a blockbuster \u2014 full of plot twists you love, soundtracks that move you, and scenes you'll replay in your memory forever. The best chapters are still unwritten.",
    emotionalNote:
      'You are rare. You are irreplaceable. And this world would be missing its brightest color without you. 🦋',
    replayText: 'Rewind & Relive 🔄',

    // ── Interactive gift box shown on the finale ──
    // Fully customisable: rename the coupons, change the emojis, add or remove
    // entries. Set `coupons: []` to hide the gift box entirely.
    gift: {
      title: 'One last thing… a gift for you',
      subtitle: 'Tap the box — every coupon is yours',
      note: 'No expiry. Redeemable whenever you need me. 💝',
      coupons: [
        {
          emoji: '🍿',
          title: 'Movie night, your pick',
          text: 'You choose the film — I bring the snacks and zero complaints.',
        },
        {
          emoji: '🍳',
          title: 'Breakfast in bed',
          text: 'One lazy morning, cooked and served with extra love.',
        },
        {
          emoji: '🫂',
          title: 'Unlimited hugs',
          text: 'Valid on good days, bad days and everything in between.',
        },
        {
          emoji: '📞',
          title: 'A whole day, just us',
          text: 'Phones off, plans cancelled. The calendar belongs to you.',
        },
      ],
    },
  },

  // ─── BACKGROUND MUSIC ──────────────────────────────────────────────
  // Replace the file at /public/music/romantic.mp3 with your own MP3.
  // Set url to null to disable music entirely.
  music: {
    url: '/music/romantic.mp3',
    label: 'Romantic melody',
  },
};

// ─── HELPER PRESETS FOR DYNAMIC CONFIG GENERATION ────────────────────
const PRESET_REASON_ICONS = ['🎭', '🧲', '🍳', '🛡️', '🔭', '🎧', '🧩', '🌊', '⭐', '💖', '✨', '🌸'];
const ROTATIONS = ['-3deg', '2deg', '-2deg', '3deg', '-1deg', '2deg'];
const DEFAULT_CAPTIONS = [
  'Where our story began 🌅',
  'Laughter that echoed for days 😂',
  'Golden hour, golden memories 🌻',
  'Adventures we never planned 🗺️',
  'Candid & perfectly imperfect 📷',
  "The one I'd frame forever 🖼️",
];

/**
 * Generates a full romantic story config object by merging customized form
 * data with sensible defaults. Matches the shape of surpriseConfig.
 *
 * @param {Object} data — customize inputs from RomanticCreate form
 * @returns {Object} full romantic configuration object
 */
export function getRomanticConfig(data = {}) {
  if (!data) return surpriseConfig;

  // Shared links must never fall back to the sample "Sarah/Alex" content when
  // the sender intentionally left a section empty.
  const isSharedStory = data.kind === 'romantic';

  const name = data.name?.trim() || surpriseConfig.person.name;
  const age = data.age !== undefined && data.age !== null && data.age !== ''
    ? data.age
    : surpriseConfig.person.age;
  const birthdayDate = data.birthdayDate?.trim() || surpriseConfig.person.birthdayDate;
  const yourName = data.yourName?.trim() || surpriseConfig.person.yourName;

  // ── Memories photos ──
  // A shared link may intentionally omit `src` (photos are device-local) while
  // keeping captions, so captions alone still produce a polaroid placeholder.
  let photos = isSharedStory ? [] : surpriseConfig.memories.photos;
  if (Array.isArray(data.photos) && data.photos.length > 0) {
    const validPhotos = data.photos.filter(
      (p) => typeof p === 'string' || p?.src || p?.caption,
    );
    if (validPhotos.length > 0) {
      photos = validPhotos.map((p, index) => {
        const src = typeof p === 'string' ? p : p.src || null;
        const caption =
          (typeof p === 'object' && p?.caption?.trim()) ||
          DEFAULT_CAPTIONS[index % DEFAULT_CAPTIONS.length];
        const rotation =
          (typeof p === 'object' && p?.rotation) ||
          ROTATIONS[index % ROTATIONS.length];
        return { src, caption, rotation };
      });
    }
  }

  // ── Reasons cards ──
  let cards = isSharedStory ? [] : surpriseConfig.reasons.cards;
  if (Array.isArray(data.reasons) && data.reasons.length > 0) {
    const validReasons = data.reasons
      .map((r) => (typeof r === 'string' ? r.trim() : r?.text?.trim()))
      .filter(Boolean);
    if (validReasons.length > 0) {
      cards = validReasons.map((text, index) => {
        const customIcon =
          typeof data.reasons[index] === 'object' && data.reasons[index]?.icon;
        return {
          icon: customIcon || PRESET_REASON_ICONS[index % PRESET_REASON_ICONS.length],
          text,
        };
      });
    }
  }

  // ── Letter paragraphs ──
  let paragraphs = isSharedStory ? [] : surpriseConfig.letter.paragraphs;
  if (data.message && typeof data.message === 'string' && data.message.trim()) {
    const split = data.message
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (split.length > 0) {
      paragraphs = split;
    }
  }

  return {
    person: {
      name,
      age,
      birthdayDate,
      yourName,
    },

    welcome: {
      ...surpriseConfig.welcome,
      // The sender's name always closes the opening line, so the very first
      // screen says who the surprise is from.
      mainTitle: `${surpriseConfig.welcome.mainTitle}\n${yourName} 💌`,
      subtitle: `A journey crafted with heart and soul for ${name}`,
    },

    reveal: {
      ...surpriseConfig.reveal,
      birthdayMessage:
        data.revealMessage?.trim() ||
        `If sunshine had a face, it would look like yours. You fill every room with warmth, every silence with laughter, and every heart with hope. This world hit the jackpot when you arrived, ${name}. 🎇`,
    },

    memories: {
      title: surpriseConfig.memories.title,
      subtitle: surpriseConfig.memories.subtitle,
      photos,
    },

    divineSky: {
      ...surpriseConfig.divineSky,
    },

    reasons: {
      title: surpriseConfig.reasons.title,
      subtitle: surpriseConfig.reasons.subtitle,
      cards,
    },

    game: {
      ...surpriseConfig.game,
    },

    lyrics: {
      ...surpriseConfig.lyrics,
    },

    heartGame: {
      ...surpriseConfig.heartGame,
    },

    thumbHeart: {
      ...surpriseConfig.thumbHeart,
    },

    alphabet: {
      ...surpriseConfig.alphabet,
    },

    letter: {
      title: surpriseConfig.letter.title,
      salutation: `Dear ${name} \u2014 yes, you,`,
      paragraphs,
      closing: surpriseConfig.letter.closing,
      signature: surpriseConfig.letter.signature,
    },

    final: {
      ...surpriseConfig.final,
      nameWish: `${name}! 🎀`,
      ageText: `A spectacular Chapter ${age} begins 🥂`,
    },

    music: {
      ...surpriseConfig.music,
    },
  };
}

export default surpriseConfig;

