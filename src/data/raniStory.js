/**
 * Rani's story payload for the shareable `/rani-story` route.
 *
 * Keeping this in one place means the public link can stay short
 * (`/rani-story`) instead of carrying a ~2.7k-character encoded blob
 * that messaging apps can truncate when it is copied or forwarded.
 *
 * Shape matches `generateRomanticShareUrl()` in `src/utils/encode.js`.
 */
export const RANI_STORY_PAYLOAD = {
  kind: 'romantic',
  name: 'Rani',
  age: 25,
  birthdayDate: 'September 15, 2026',
  yourName: 'Vedant',
  message: [
    "I've started writing this letter a hundred times in my head and erased it a hundred more. Not because I don't know what to say, but because no combination of twenty-six letters could ever capture what you are to me.",
    'You are the plot twist I never saw coming \u2014 the kind that rewrites the whole story for the better. Before you, my days had colour. After you, they had meaning.',
    "There are people who light up a room by walking in. And then there's you \u2014 who lights up a room just by existing somewhere in the same city. That's your superpower, and you wield it without even trying.",
    "So here's my birthday wish for you: may you feel, even for a second today, as remarkable as you make everyone else feel every single day. You are once-in-a-lifetime. Never forget that. \u2728",
  ].join('\n\n'),
  reasons: [
    'Because your smile arrives before your words and stays long after you leave.',
    'Because you make ordinary Tuesdays feel like something worth remembering.',
    'Because your laugh is my favourite sound in any language.',
    'Because you are soft with people, even when the world is not soft with you.',
    'Because you notice the little things no one else does.',
    'Because you turn silence into comfort instead of distance.',
    'Because you believe in me on the days I forget how.',
    'Because your hugs feel like coming home after a long year.',
    'Because you make me feel seen without having to explain myself.',
    'Because your heart is the safest place I have ever lived.',
  ],
  photos: [
    { src: null, caption: 'the first hello', rotation: '-3deg' },
    { src: null, caption: 'our favourite kind of ordinary', rotation: '2.5deg' },
    { src: null, caption: 'that night under the stars', rotation: '-1.5deg' },
    { src: null, caption: 'your laugh, mid-sentence', rotation: '3deg' },
    { src: null, caption: 'the little adventures', rotation: '-2.5deg' },
    { src: null, caption: 'us, exactly like this', rotation: '1.5deg' },
  ],
  photosOmitted: false,
};

export default RANI_STORY_PAYLOAD;
