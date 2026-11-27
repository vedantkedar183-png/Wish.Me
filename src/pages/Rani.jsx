import { useEffect } from 'react';
import ConstellationExhibition from '../components/romantic/ConstellationExhibition';

/**
 * Standalone single-page experience for Rani.
 *
 * Route: /rani
 * — a constellation that spells her name
 * — a virtual exhibition room with cinematic scene changes
 * — a little cat couple page (two cats in love, one kiss)
 * — a "my love, my forever" closing letter
 */
export default function Rani() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Rani \u2014 My Love, My Forever';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return <ConstellationExhibition standalone name="Rani" />;
}
