import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ─── Constants ────────────────────────────────────────────────────────────────
const FORM_STORAGE_KEY = 'wishora_birthday_data';
const PHOTO_KEY_PREFIX = 'wishora_photo_';

const DEFAULT_FORM = {
  name: '',
  message: '',
  fromName: '',
  theme: 'romantic',
  music: 'none',
  photoId: null,
  photoIds: [],  // Multi-photo support (array of photo IDs)
  template: null, // Selected greeting card template ID
};

// ─── Context ──────────────────────────────────────────────────────────────────
const BirthdayContext = createContext(null);

/**
 * Provides birthday form data to the entire app.
 * Form fields (name, message, theme, etc.) are persisted via localStorage.
 * The photo is stored separately as a large base64 blob keyed by a unique ID.
 */
export function BirthdayProvider({ children }) {
  const [formData, setFormData] = useLocalStorage(FORM_STORAGE_KEY, DEFAULT_FORM);

  /** Merge partial updates into the form state. */
  const updateForm = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, [setFormData]);

  /** Wipe all form data and all stored photos. */
  const resetForm = useCallback(() => {
    // Remove single photo
    if (formData.photoId) {
      try {
        localStorage.removeItem(`${PHOTO_KEY_PREFIX}${formData.photoId}`);
      } catch {
        // Ignore
      }
    }
    // Remove multi-photos
    if (formData.photoIds?.length) {
      formData.photoIds.forEach((id) => {
        try {
          localStorage.removeItem(`${PHOTO_KEY_PREFIX}${id}`);
        } catch {
          // Ignore
        }
      });
    }
    setFormData(DEFAULT_FORM);
  }, [formData.photoId, formData.photoIds, setFormData]);

  /**
   * Save a base64-encoded photo to localStorage.
   * localStorage quota is typically 5–10 MB; base64 images can be large.
   * If storage fails, we gracefully degrade (no photo on the birthday page).
   *
   * @param {string} base64 — data URL string
   * @param {string} id — unique photo ID (stored alongside form data)
   * @returns {boolean} — true if saved successfully
   */
  const savePhoto = useCallback((base64, id) => {
    try {
      localStorage.setItem(`${PHOTO_KEY_PREFIX}${id}`, base64);
      return true;
    } catch (err) {
      console.warn('[Wishora] Photo could not be saved (quota exceeded?):', err);
      return false;
    }
  }, []);

  /**
   * Retrieve a previously saved photo by ID.
   * @param {string|null} id
   * @returns {string|null} base64 data URL or null
   */
  const getPhoto = useCallback((id) => {
    if (!id) return null;
    try {
      return localStorage.getItem(`${PHOTO_KEY_PREFIX}${id}`);
    } catch {
      return null;
    }
  }, []);

  return (
    <BirthdayContext.Provider
      value={{ formData, updateForm, resetForm, savePhoto, getPhoto }}
    >
      {children}
    </BirthdayContext.Provider>
  );
}

/**
 * Hook to access the birthday context.
 * Must be used inside a <BirthdayProvider>.
 */
export function useBirthday() {
  const ctx = useContext(BirthdayContext);
  if (!ctx) {
    throw new Error('useBirthday must be used within a <BirthdayProvider>');
  }
  return ctx;
}
