// ─── Form Validation ──────────────────────────────────────────────────────────

export const MAX_MESSAGE_LENGTH = 500;
export const MAX_NAME_LENGTH = 50;
export const MAX_FROM_LENGTH = 30;
export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

/**
 * Validate the birthday person's name.
 * @param {string} name
 * @returns {string|null} error message or null
 */
export function validateName(name) {
  if (!name || !name.trim()) {
    return "Please enter the birthday person's name.";
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long.';
  }
  if (name.trim().length > MAX_NAME_LENGTH) {
    return `Name must be at most ${MAX_NAME_LENGTH} characters.`;
  }
  return null;
}

/**
 * Validate the personal birthday message.
 * @param {string} message
 * @returns {string|null} error message or null
 */
export function validateMessage(message) {
  if (!message || !message.trim()) {
    return 'Please write a birthday message.';
  }
  if (message.trim().length < 5) {
    return 'Message must be at least 5 characters long.';
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return `Message must be at most ${MAX_MESSAGE_LENGTH} characters.`;
  }
  return null;
}

/**
 * Validate an uploaded photo file.
 * @param {File|null} file
 * @returns {string|null} error message or null (photo is optional)
 */
export function validatePhotoFile(file) {
  if (!file) return null; // Photo is optional

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Please upload a JPG, PNG, WebP, or GIF image.';
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_FILE_SIZE_MB} MB.`;
  }

  return null;
}

/**
 * Validate the entire form and return an errors object.
 * @param {{ name: string, message: string }} formData
 * @returns {Record<string, string>} — empty object means valid
 */
export function validateForm(formData) {
  const errors = {};

  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;

  const messageError = validateMessage(formData.message);
  if (messageError) errors.message = messageError;

  return errors;
}
