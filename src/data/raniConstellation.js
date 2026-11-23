/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  RANI — A CONSTELLATION OF US
 *
 *  The content for the constellation / virtual-exhibition chapter.
 *  Every star below spells part of her name and holds a hidden message.
 *  The gallery holds four framed memories, and the hall holds 100 reasons.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Twelve named stars placed on the vertices of the letters R, A, N, I.
 * Coordinates are percentages inside a 100 × 100 viewBox.
 */
export const CONSTELLATION_STARS = [
  {
    id: 'first-hello',
    letter: 'R',
    x: 10,
    y: 22,
    title: 'The First Hello',
    emoji: '🌠',
    message:
      'I did not know it then, but the universe had just introduced me to my favourite person. One hello, and every road I had ever taken started pointing toward you.',
  },
  {
    id: 'your-laugh',
    letter: 'R',
    x: 24,
    y: 22,
    title: 'The Way You Laugh',
    emoji: '✨',
    message:
      'There is a laugh you do when you are truly happy \u2014 the one you try to hide behind your hand. I look for it every single day. It is the sound my heart uses to measure joy.',
  },
  {
    id: 'your-hand',
    letter: 'R',
    x: 10,
    y: 45,
    title: 'Your Hand in Mine',
    emoji: '🤍',
    message:
      'The first time our fingers linked, I felt my whole future shift into place. It was not fireworks. It was quieter than that \u2014 it felt like arriving.',
  },
  {
    id: 'ordinary-tuesday',
    letter: 'R',
    x: 10,
    y: 78,
    title: 'The Ordinary Tuesday',
    emoji: '☕',
    message:
      'Nothing happened that day, and everything did. You were there, across the table, stealing my fries and my attention. I remember thinking: this is the life I want.',
  },
  {
    id: 'your-name',
    letter: 'A',
    x: 33,
    y: 78,
    title: 'Your Name',
    emoji: '💫',
    message:
      'Two syllables, and somehow they sound like the beginning of my favourite story. I say your name softly when I miss you. It always feels like coming home.',
  },
  {
    id: 'little-things',
    letter: 'A',
    x: 43,
    y: 22,
    title: 'The Little Things',
    emoji: '🕯️',
    message:
      'The saved song. The extra blanket. The way you remember how I take my tea. You love me in details most people walk past \u2014 and those details built a whole world for me.',
  },
  {
    id: 'future-we-drew',
    letter: 'A',
    x: 53,
    y: 78,
    title: 'The Future We Drew',
    emoji: '🏡',
    message:
      'A house with too many books, a kitchen that always smells like something warm, and you in every room. I never wanted a map until I started drawing it with you.',
  },
  {
    id: 'way-you-look',
    letter: 'N',
    x: 58,
    y: 22,
    title: 'The Way You Look at Me',
    emoji: '👀',
    message:
      'You look at me like I am not a chapter but the whole book. I have spent my life trying to be understood, and then you arrived and did it without asking me to explain.',
  },
  {
    id: 'worst-day',
    letter: 'N',
    x: 76,
    y: 78,
    title: 'Our Worst Day',
    emoji: '🌧️',
    message:
      'We did not break. We learned how to hold each other in the rain. That is the memory I hold when I need proof that this is real \u2014 not the easy days, but the day you stayed.',
  },
  {
    id: 'this-moment',
    letter: 'N',
    x: 76,
    y: 22,
    title: 'This Moment',
    emoji: '🌙',
    message:
      'Right now. Under these same stars, with your name in my mouth and your light in my chest. I am choosing you again, exactly as you are, exactly as we are.',
  },
  {
    id: 'three-am',
    letter: 'I',
    x: 89,
    y: 22,
    title: 'Three A.M. Conversations',
    emoji: '🌌',
    message:
      'The world asleep, your voice in my ear, and me realising I could stay awake forever. Some people talk to fill silence. With you, silence is just another way of saying everything.',
  },
  {
    id: 'storm',
    letter: 'I',
    x: 89,
    y: 78,
    title: 'The Storm We Survived',
    emoji: '⛈️',
    message:
      'We came out of it with wet shoulders and the same stubborn heart. You taught me that love is not the absence of storms \u2014 it is a hand that does not let go in the middle of one.',
  },
];

/** The special star that wakes up only when all twelve are found. */
export const FOREVER_STAR = {
  id: 'forever-star',
  letter: '\u2726',
  title: 'The Forever Star',
  emoji: '💖',
  message:
    'You found every hidden piece of my sky. So here is the secret they were all keeping: every star had your name on it. Every road, every ordinary Tuesday, every storm \u2014 all of it was leading me to you. My love. My forever.',
};

/** SVG line paths that draw the letters R, A, N and I between the stars. */
export const LETTER_PATHS = [
  { letter: 'R', d: 'M10 22 L24 22 L25 44 L10 45 L10 78 M10 45 L25 78' },
  { letter: 'A', d: 'M33 78 L43 22 L53 78 M37.5 59 L48.5 59' },
  { letter: 'N', d: 'M58 78 L58 22 L76 78 L76 22' },
  { letter: 'I', d: 'M84 22 L94 22 M89 22 L89 78 M84 78 L94 78' },
];

export const LETTER_LABELS = [
  { letter: 'R', x: 17, y: 93 },
  { letter: 'A', x: 43, y: 93 },
  { letter: 'N', x: 67, y: 93 },
  { letter: 'I', x: 89, y: 93 },
];

/** Four framed pieces hanging in the virtual gallery. */
export const GALLERY_PIECES = [
  {
    id: 'beginning',
    art: 'dawn',
    chapter: 'Chapter I',
    title: 'The Beginning',
    body:
      'I do not remember the exact second the world changed. I remember the feeling \u2014 like a door opening in a house I had lived in all my life. You walked in, and every room got warmer.',
  },
  {
    id: 'laughter',
    art: 'constellation',
    chapter: 'Chapter II',
    title: 'The Laughter',
    body:
      'Some people make you laugh. You make me laugh, and then keep me laughing at the fact that I am laughing. It is absurd. It is my favourite sound. It is the soundtrack of every ordinary day I want to keep.',
  },
  {
    id: 'promise',
    art: 'bloom',
    chapter: 'Chapter III',
    title: 'The Promise',
    body:
      'It was not a grand speech. It was a hand held a little tighter in the dark. A promise that whatever came next, we would meet it side by side. That is still the whole plan.',
  },
  {
    id: 'forever',
    art: 'infinity',
    chapter: 'Chapter IV',
    title: 'The Forever',
    body:
      'I used to think forever was a big, frightening word. Then I met you and it became something small and warm: a shared blanket, a second cup of tea, a million more nights under the same sky.',
  },
];

/**
 * One hundred reasons. Each one is written to be read in his voice.
 * Keep this list at 100 \u2014 the page builds its ten chapters from it.
 */
export const HUNDRED_REASONS = [
  // I
  'Because your smile arrives before your words and stays long after you leave.',
  'Because you make ordinary Tuesdays feel like something worth remembering.',
  'Because you listen like the whole world can wait.',
  'Because your laugh is my favourite sound in any language.',
  'Because you are soft with people, even when the world is not soft with you.',
  'Because you say my name like it is a promise.',
  'Because you notice the little things no one else does.',
  'Because your eyes hold a whole sky I never get tired of looking at.',
  'Because you turn silence into comfort instead of distance.',
  'Because you believe in me on the days I forget how.',
  // II
  'Because your hugs feel like coming home after a long year.',
  'Because you are brave in ways you do not give yourself credit for.',
  'Because you dance badly and beautifully at the same time.',
  'Because you care enough to ask twice.',
  'Because your kindness has no audience.',
  'Because you make me want to be gentler with myself.',
  'Because every plan sounds better when your name is in it.',
  'Because you remember the songs that made us.',
  'Because your hand fits mine like it was measured.',
  'Because you forgive quickly but love deeply.',
  // III
  'Because even your sleepy voice is my favourite morning song.',
  'Because you make me laugh in the middle of arguments.',
  'Because you never make me feel small for feeling big.',
  'Because you are the first person I want to tell everything to.',
  'Because your presence quietens every loud room.',
  'Because you look beautiful in every light, especially the honest one.',
  'Because you keep growing and let me grow beside you.',
  'Because you choose us, again and again, even on hard days.',
  'Because your dreams make me dream bigger.',
  'Because you are never cruel, even when you are hurt.',
  // IV
  'Because you steal my hoodies and somehow make them look better.',
  'Because your forehead kiss fixes more than medicine.',
  'Because you text me things that make me smile at my phone like a fool.',
  'Because you are patient with my silences and curious about my chaos.',
  'Because you love loudly enough to make me believe in forever.',
  'Because your heart is the safest place I have ever lived.',
  'Because you make me feel seen without having to explain myself.',
  'Because you bring out the child in me who still believes in magic.',
  'Because you make even waiting in line feel like a date.',
  'Because your advice is honest and your comfort is warm.',
  // V
  'Because you hold my secrets like they are sacred.',
  'Because you look at me like I am still a surprise.',
  'Because you are the reason my future looks less like a question mark.',
  'Because you are equally beautiful when you are messy and unguarded.',
  'Because your determination inspires me more than you know.',
  'Because you turn my bad days into survivable ones.',
  'Because you laugh at your own jokes first.',
  'Because you never let me go to sleep angry.',
  'Because your voice is the last thing I want to hear at night.',
  'Because you make love feel like a verb, not a word.',
  // VI
  'Because you notice when I am quiet and sit with me in it.',
  'Because you have seen my worst and stayed for my best.',
  'Because your family stories make me love the person they raised.',
  'Because you make me believe that home can be a person.',
  'Because you respect my dreams even when they are inconvenient.',
  'Because your excitement over small things is contagious.',
  'Because you always know when I need a snack and a nap.',
  'Because you fight for the people you love with everything you have.',
  'Because you apologise with your whole heart.',
  'Because you make me want to write better poetry than I know how.',
  // VII
  'Because your beauty is the kind that grows with knowing you.',
  'Because you never stopped choosing the version of me that was still becoming.',
  'Because you make time slow down when we are doing nothing together.',
  'Because your trust is a gift I never want to mishandle.',
  'Because you make me feel brave enough to be honest.',
  'Because every version of the future I like has you in it.',
  'Because you are the plot twist that made my life make sense.',
  'Because you still get shy when I compliment you.',
  'Because you celebrate my wins like they are your own.',
  'Because you turn my fears into conversations instead of walls.',
  // VIII
  'Because your morning hair is a whole personality.',
  'Because you are the only person I never get tired of talking to.',
  'Because you make even the rain feel romantic.',
  'Because you are strong without being hard.',
  'Because you give the best hugs and the worst puns, and I love both.',
  'Because you make me feel like I am enough, exactly as I am.',
  'Because your warmth is the first thing I feel when I walk in.',
  'Because you dream out loud and let me build with you.',
  'Because you are my favourite hello and my hardest goodbye.',
  'Because you make commitment sound like an adventure, not a cage.',
  // IX
  'Because you listen to my favourite songs just to understand me.',
  'Because your smile is my instant mood repair.',
  'Because you never make love feel like a performance.',
  'Because you are the reason I believe in second chances.',
  'Because your kindness extends to strangers and animals and old songs.',
  'Because you make me want to be a better man, not a different one.',
  'Because you are the calm after every storm in my head.',
  'Because your laugh in the dark is enough to find my way home.',
  'Because you love me in the tiny details, not just the grand gestures.',
  'Because you make forever feel less like a risk and more like a promise.',
  // X
  'Because you are the first thought in my morning and the last prayer at night.',
  'Because you make me feel like the best part of your day is me.',
  'Because you still choose honesty over easy.',
  'Because your heart remembers everyone who ever needed it.',
  'Because you make the world softer just by being in it.',
  'Because I would choose you in every version of this life.',
  'Because you are my peace, my passion, my favourite person.',
  'Because loving you is the easiest thing I have ever done.',
  'Because after all this time, you are still the person I want to impress.',
  'Because forever with you still does not feel long enough \u2014 and that is how I know it is forever.',
];

/** The closing letter and final scene copy. Placeholders are filled by the page. */
export const FOREVER = {
  eyebrow: 'the last star',
  title: 'My love. My forever.',
  intro:
    'If the universe ever asks me what I did with my one life, I will tell it I loved you.',
  paragraphs: [
    'Not perfectly. Not gracefully every day. But completely \u2014 with the kind of love that shows up on the ordinary Tuesdays and stays through the storms.',
    'You are my home, my favourite adventure, and the answer to prayers I did not know how to say. Every star above us is a promise I intend to keep.',
    'So here is my forever, {name}: more midnight talks, more terrible jokes, more shared silences, more versions of us. I choose you. Again. Always.',
  ],
  signature: 'Yours, in this life and every one after',
  finalReason:
    'Because forever with you still does not feel long enough \u2014 and that is how I know it is forever.',
};

/** Replace {name} in copy with the recipient's name. */
export function fillName(text, name) {
  return String(text).replace(/\{name\}/g, name || 'you');
}
