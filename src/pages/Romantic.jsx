import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import RomanticSurprise from '../components/romantic/RomanticSurprise';
import { decodePayload, decodeSurpriseData } from '../utils/encode';

const PREVIEW_FLAG = 'wishora_romantic_preview';

/**
 * Romantic page — only renders the surprise experience when:
 *  1. A shared link with ?d= story data is present, OR
 *  2. The user just came from /romantic/create (preview hand-off).
 *
 * Otherwise redirects to /romantic/create so the creator doesn't
 * accidentally see the recipient-facing "Shhh…" screen.
 */
export default function Romantic() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);

  // The create form passes this via navigate(..., { state }). Unlike the
  // sessionStorage flag, location state survives React StrictMode's
  // double-invoked effects (React 18 runs mount effects twice in dev).
  const previewRequested = location.state?.preview === true;

  // A shared link carries the whole story in ?d=<base64url>.
  // The second decoder keeps old-format links working.
  const [sharedData] = useState(() => {
    try {
      const encoded = searchParams.get('d');
      if (!encoded) return null;
      return decodePayload(encoded) || decodeSurpriseData(encoded);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const hasUrlData = searchParams.has('d');

    if (sharedData) {
      setReady(true);
      return;
    }

    // A malformed/expired shared link should not silently show sample data.
    if (hasUrlData) {
      navigate('/romantic/create', { replace: true });
      return;
    }

    let hasSessionFlag = false;
    try {
      hasSessionFlag = sessionStorage.getItem(PREVIEW_FLAG) === '1';
    } catch {
      // ignore
    }

    if (previewRequested || hasSessionFlag) {
      setReady(true);
    } else {
      navigate('/romantic/create', { replace: true });
    }
    // Mount-only: search params, shared data and preview state are captured once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear the fallback flag only *after* the page has successfully opened, so
  // a refresh doesn't re-show the surprise, while StrictMode's second effect
  // run still sees the location state above.
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.removeItem(PREVIEW_FLAG);
    } catch {
      // ignore
    }
  }, [ready]);

  if (!ready) return null;

  return <RomanticSurprise data={sharedData} />;
}
