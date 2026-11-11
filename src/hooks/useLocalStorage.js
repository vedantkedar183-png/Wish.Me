import { useState, useCallback } from 'react';

/**
 * A drop-in replacement for useState that also persists the value to localStorage.
 * On mount, initializes from localStorage (falling back to initialValue).
 *
 * @template T
 * @param {string} key - The localStorage key.
 * @param {T} initialValue - Fallback if nothing is stored yet.
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.warn(`[useLocalStorage] Failed to read key "${key}":`, err);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue((prev) => {
          const valueToStore =
            typeof value === 'function' ? value(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (err) {
        console.warn(`[useLocalStorage] Failed to write key "${key}":`, err);
      }
    },
    [key],
  );

  return [storedValue, setValue];
}
