import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import RomanticSurprise from '../components/romantic/RomanticSurprise';

/**
 * Romantic page — only renders the surprise experience when:
 *  1. A shared link with ?d= data is present, OR
 *  2. The user just came from /romantic/create (session flag set).
 *
 * Otherwise redirects to /romantic/create so the creator doesn't
 * accidentally see the recipient-facing "Shhh…" screen.
 */
export default function Romantic() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasUrlData = searchParams.has('d');

    // The create form sets this flag right before navigating here
    let hasSessionFlag = false;
    try {
      hasSessionFlag = sessionStorage.getItem('wishora_romantic_preview') === '1';
      // Clear it so refreshing the page doesn't re-show the surprise
      sessionStorage.removeItem('wishora_romantic_preview');
    } catch {
      // ignore
    }

    if (hasUrlData || hasSessionFlag) {
      setReady(true);
    } else {
      navigate('/romantic/create', { replace: true });
    }
  }, []);

  if (!ready) return null;

  return <RomanticSurprise />;
}
