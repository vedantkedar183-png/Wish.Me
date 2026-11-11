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
    console.error('[Wish.Me] decodeSurpriseData failed:', err);
    return null;
  }
}

// ─── Backward-compatible aliases ──────────────────────────────────────────────
export const encodeBirthdayData = encodeSurpriseData;
export const decodeBirthdayData = decodeSurpriseData;

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

  const origin = window.location.origin;
  return `${origin}/surprise?d=${encodeURIComponent(encoded)}`;
}
