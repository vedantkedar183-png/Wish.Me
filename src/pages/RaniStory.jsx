import { useEffect } from 'react';
import RomanticSurprise from '../components/romantic/RomanticSurprise';
import { RANI_STORY_PAYLOAD } from '../data/raniStory';

/**
 * Public direct-open story for Rani.
 *
 * Route: /rani-story
 * No query string, no builder, no preview flag — the full 15-chapter
 * experience starts on the lock screen as soon as the link opens.
 */
export default function RaniStory() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Rani \u2014 My love, my forever';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return <RomanticSurprise data={RANI_STORY_PAYLOAD} />;
}
