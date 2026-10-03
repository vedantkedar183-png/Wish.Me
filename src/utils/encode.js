// ─── URL Encoding / Decoding ──────────────────────────────────────────────────
// Birthday page data (name, message, theme, music, fromName, photoId) is
// encoded as a base64 string in the URL query param `?d=...`.
// The uploaded photo itself is kept in localStorage (see BirthdayContext).
//
// Limitation: recipients on a *different* device/browser won't see the photo
// because localStorage is device-local. Everything else (name, message, theme,
// music) travels fully in the URL and works across devices/browsers.

/**
 * Encode a plain object to a URL-safe base64 string.
 * @param {Object} data
 * @returns {string|null}
 */
export function encodeBirthdayData(data) {
  try {
    const json = JSON.stringify(data);
    // encodeURIComponent handles non-ASCII characters (e.g. emojis in messages)
    const encoded = btoa(encodeURIComponent(json));
    return encoded;
  } catch (err) {
    console.error('[Wishora] encodeBirthdayData failed:', err);
    return null;
  }
}

/**
 * Decode a base64 string back to the birthday data object.
 * @param {string} encoded
 * @returns {Object|null}
 */
export function decodeBirthdayData(encoded) {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (err) {
    console.error('[Wishora] decodeBirthdayData failed:', err);
    return null;
  }
}

/**
 * Build a full shareable URL for a birthday page.
 * @param {Object} formData — the current birthday form state
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
    photoId: formData.photoId || null,
    photoIds: formData.photoIds?.length ? formData.photoIds : undefined,
    template: formData.template || undefined,
  };

  const encoded = encodeBirthdayData(sharePayload);
  if (!encoded) return null;

  const base = `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}`;
  // Strip any existing /surprise or /create segments to get the app root
  const origin = window.location.origin;
  return `${origin}/surprise?d=${encodeURIComponent(encoded)}`;
}
