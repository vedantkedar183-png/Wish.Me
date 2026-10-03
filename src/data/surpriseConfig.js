/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║         Wishora — Romantic Birthday Surprise Config              ║
 * ║                                                                  ║
 * ║  This is the ONLY file you need to edit to customise the         ║
 * ║  entire birthday experience. Change names, messages, photos,     ║
 * ║  reasons, the letter, and music right here.                      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export const surpriseConfig = {

  // ─── PERSON DETAILS ────────────────────────────────────────────────
  person: {
    name: 'Sarah',               // Birthday person's name (shown prominently)
    age: 25,                     // Age they are turning
    birthdayDate: 'September 15, 2026',
    yourName: 'Alex',            // Your name — used in the letter closing
  },

  // ─── WELCOME SCREEN ────────────────────────────────────────────────
  welcome: {
    preMessage: '✨ Someone made something very special just for you ✨',
    mainTitle: 'Close your eyes\nand take a deep breath…',
    subtitle: 'Something magical is about to begin',
    buttonText: 'Open Your Surprise 💕',
  },

  // ─── BIRTHDAY REVEAL ───────────────────────────────────────────────
  reveal: {
    topLine: 'Today is the most wonderful day of the year,',
    bottomLine: 'because the world got YOU in it.',
    birthdayMessage:
      'You mean the absolute world to me. Every single day you make my life so much brighter and fuller. I am genuinely the luckiest person alive because I get to know you. 🌸',
    continueText: "There's more waiting for you →",
  },

  // ─── MEMORIES GALLERY ──────────────────────────────────────────────
  // HOW TO ADD YOUR OWN PHOTOS:
  //   1. Place your photos inside the  /public/photos/  folder
  //   2. Change each  src  to  '/photos/your-file-name.jpg'
  //   3. Adjust  rotation  (-5deg to 5deg) for the polaroid look
  memories: {
    title: 'Our Beautiful Memories',
    subtitle: 'Every moment with you is one I never want to forget 📸',
    photos: [
      { src: 'https://picsum.photos/seed/wsh1/360/440', caption: 'The day everything changed ✨',     rotation: '-3deg' },
      { src: 'https://picsum.photos/seed/wsh2/360/440', caption: 'My favourite smile in the world 🌸', rotation:  '2deg' },
      { src: 'https://picsum.photos/seed/wsh3/360/440', caption: 'This moment, forever 💕',           rotation: '-2deg' },
      { src: 'https://picsum.photos/seed/wsh4/360/440', caption: 'Pure happiness 🎉',                  rotation:  '3deg' },
      { src: 'https://picsum.photos/seed/wsh5/360/440', caption: 'My favourite person 🥰',             rotation: '-1deg' },
      { src: 'https://picsum.photos/seed/wsh6/360/440', caption: 'We make the best memories 🌹',       rotation:  '2deg' },
    ],
  },

  // ─── REASONS YOU'RE SPECIAL ────────────────────────────────────────
  reasons: {
    title: 'Why You Are So Special to Me',
    subtitle: 'Just a few of the thousands of reasons… 💝',
    cards: [
      { icon: '🌸', text: 'Your laugh is literally the most beautiful sound in the entire world'        },
      { icon: '💫', text: 'You make even the most ordinary moments feel magical and unforgettable'      },
      { icon: '🌹', text: 'Your kindness and warmth touches everyone who is lucky enough to know you'   },
      { icon: '✨', text: 'You inspire me to become a better version of myself every single day'        },
      { icon: '💕', text: 'The way your eyes light up when you talk about the things you love'          },
      { icon: '🎀', text: 'Your strength and resilience — the way you handle everything with such grace'},
      { icon: '🦋', text: 'You are my absolute favourite person to spend every single moment with'      },
      { icon: '🌙', text: 'You make my whole world so much brighter, warmer, and full of love'          },
    ],
  },

  // ─── LOVE LETTER ───────────────────────────────────────────────────
  letter: {
    title: 'A Little Letter, Just for You',
    salutation: 'My dearest Sarah,',
    paragraphs: [
      'Today, the world got a little bit more magical — because you were born into it. On this special day, I want you to know just how deeply, completely, and unconditionally you are loved.',
      'Every single day that I get to share with you is a gift I will never take for granted. You bring so much warmth, laughter, and love into my life — more than you will ever truly know, no matter how many times I try to tell you.',
      'You are extraordinary in every possible way. Your smile, your voice, your heart — everything about you is so wonderfully, beautifully, perfectly you. The world is a genuinely better place because you are in it.',
      'On your birthday, I wish you all the happiness your heart can hold, all the adventures your spirit can dream of, and all the love you so completely and utterly deserve. Happy birthday, my love. 🌸',
    ],
    closing: 'With all my heart,',
    signature: 'Yours, always and forever ❤️',
  },

  // ─── FINAL BIRTHDAY SURPRISE ───────────────────────────────────────
  final: {
    preText: 'And most importantly of all…',
    mainWish: 'Happy Birthday,',
    nameWish: 'Sarah! 🎂',
    ageText: 'A magical 25th birthday 🥳',
    message:
      'May this year bring you more joy, more laughter, more adventures, and more love than you ever thought possible. You deserve every single bit of it — and so much more.',
    emotionalNote:
      'Thank you for existing. Thank you for being exactly who you are. Thank you for making my world so incredibly, beautifully wonderful. 🌸',
    replayText: 'Replay from the Beginning ❤️',
  },

  // ─── BACKGROUND MUSIC ──────────────────────────────────────────────
  // Replace the file at /public/music/romantic.mp3 with your own MP3.
  // Set url to null to disable music entirely.
  music: {
    url: '/music/romantic.mp3',
    label: 'Romantic melody',
  },
};
