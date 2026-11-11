// ─── URL Encoding / Decoding ──────────────────────────────────────────────────
// Surprise page data (name, message, theme, music, fromName, occasion, etc.) is
// encoded as a base64 string in the URL query param `?d=...`.
// The uploaded photo itself is kept in localStorage (see BirthdayContext).
//
// Limitation: recipients on a *different* device/browser won't see the photo
// because localStorage is device-local. Everything else (name, message, theme,
// music, occasion) travels fully in the URL and works across devices/browsers.

/**
 * Encode a plain object to a URL-safe base64 string.
 * @param {Object} data
 * @returns {string|null}
 */
export function encodeSurpriseData(data) {
  try {
    const json = JSON.stringify(data);
    // encodeURIComponent handles non-ASCII characters (e.g. emojis in messages)
    const encoded = btoa(encodeURIComponent(json));
    return encoded;
  } catch (err) {
    console.error('[Wish.Me] encodeSurpriseData failed:', err);
    return null;
  }
}

/**
 * Decode a base64 string back to the surprise data object.
 * @param {string} encoded
 * @returns {Object|null}
 */
export function decodeSurpriseData(encoded) {
  try {
    if (!encoded || typeof encoded !== 'string') return null;
    const json = decodeURIComponent(atob(encoded));
    const data = JSON.parse(json);
    // Basic sanity check: must have a name
    if (!data || typeof data !== 'object' || !data.name) return null;
    return data;
  } catch (err) {
    // Malformed/expired shared links are an expected user input, not a crash.
    console.warn('[Wish.Me] decodeSurpriseData failed:', err);
    return null;
  }
}

// ─── Backward-compatible aliases ──────────────────────────────────────────────
export const encodeBirthdayData = encodeSurpriseData;
export const decodeBirthdayData = decodeSurpriseData;

// ─── Compact (base64url) payloads ─────────────────────────────────────────────
// JSON -> UTF-8 bytes -> base64url. Roughly 1.33x the JSON size (vs ~3x for
// the btoa(encodeURIComponent(...)) scheme) which keeps shared links shorter.
function toBase64Url(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Encode an object to a compact URL-safe string. */
export function encodePayload(data) {
  try {
    return toBase64Url(JSON.stringify(data));
  } catch (err) {
    console.error('[Wish.Me] encodePayload failed:', err);
    return null;
  }
}

/** Decode a compact URL-safe string back into an object (null if invalid). */
export function decodePayload(encoded) {
  try {
    if (!encoded || typeof encoded !== 'string') return null;
    const data = JSON.parse(fromBase64Url(encoded));
    if (!data || typeof data !== 'object') return null;
    return data;
  } catch (err) {
    // Malformed/expired shared links are an expected user input, not a crash.
    console.warn('[Wish.Me] decodePayload failed:', err);
    return null;
  }
}

/** Absolute URL for a route, respecting the Vite base path. */
export function absoluteUrl(path) {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${window.location.origin}${normalizedBase}${path.replace(/^\//, '')}`;
}

/**
 * Build a full shareable URL for a surprise page.
 * @param {Object} formData — the current form state
 * @returns {string|null}
 */
export function generateShareUrl(formData) {
  if (!formData?.name) return null;

  // Only include fields that can safely travel in a URL
  const sharePayload = {
    name: formData.name,
    message: formData.message,
    fromName: formData.fromName,
    theme: formData.theme,
    music: formData.music,
    occasion: formData.occasion || 'birthday',
    photoId: formData.photoId || null,
    photoIds: formData.photoIds?.length ? formData.photoIds : undefined,
    template: formData.template || undefined,
  };

  const encoded = encodeSurpriseData(sharePayload);
  if (!encoded) return null;

  return absoluteUrl(`surprise?d=${encodeURIComponent(encoded)}`);
}

// ─── Romantic story sharing ───────────────────────────────────────────────────
// The romantic story carries text in the URL. Photos are base64 blobs stored in
// localStorage, so we only inline them when the story is small enough to keep
// the link usable. Larger sets fall back to captioned placeholders on the
// recipient's device.
const ROMANTIC_PHOTO_BUDGET = 40000; // characters (~30 KB of image data)

/**
 * Build a shareable URL for a romantic story config.
 *
 * @param {Object} config — output of getRomanticConfig()
 * @returns {{ url: string, photosOmitted: boolean } | null}
 */
export function generateRomanticShareUrl(config) {
  if (!config?.person?.name) return null;

  const photos = Array.isArray(config.memories?.photos) ? config.memories.photos : [];
  const totalPhotoChars = photos.reduce(
    (sum, p) => sum + (typeof p?.src === 'string' ? p.src.length : 0),
    0,
  );
  const photosOmitted = totalPhotoChars > ROMANTIC_PHOTO_BUDGET;

  const payload = {
    kind: 'romantic',
    name: config.person.name,
    age: config.person.age,
    birthdayDate: config.person.birthdayDate,
    yourName: config.person.yourName,
    message: (config.letter?.paragraphs || []).join('\n\n'),
    reasons: (config.reasons?.cards || []).map((c) => c.text),
    photos: photos.map((p) => ({
      src: photosOmitted ? null : p.src || null,
      caption: p.caption || '',
      rotation: p.rotation || '0deg',
    })),
    photosOmitted,
  };

  const encoded = encodePayload(payload);
  if (!encoded) return null;

  // base64url is already URL-safe — no extra percent-encoding needed.
  return {
    url: absoluteUrl(`romantic?d=${encoded}`),
    photosOmitted,
  };
}
