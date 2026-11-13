/**
 * A small light-pink lip print, used on the lucky-number page.
 *
 * Two halves with a soft gap so the mark reads as lips rather than a heart.
 */
const KISS_UPPER =
  'M16,46 C10,36 17,25 29,27 C39,29 45,35 50,40 C55,35 61,29 71,27 C83,25 90,36 84,46 C75,49 63,47 50,45 C37,47 25,49 16,46 Z';
const KISS_LOWER =
  'M17,50 C21,62 34,70 50,70 C66,70 79,62 83,50 C74,53 62,55 50,55 C38,55 26,53 17,50 Z';

export default function KissMark({ className = '', style }) {
  return (
    <svg viewBox="0 0 100 80" className={className} style={style} aria-hidden="true">
      <g fill="currentColor">
        <path d={KISS_UPPER} />
        <path d={KISS_LOWER} />
      </g>
    </svg>
  );
}
