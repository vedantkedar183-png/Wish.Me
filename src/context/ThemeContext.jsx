import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'wishora_theme_mode';

/**
 * Manages dark/light/system color mode across the entire app.
 * Persists user preference to localStorage.
 */
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  // Compute effective mode (resolve 'system')
  const isDark = mode === 'dark' || 
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Persist preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore
    }
  }, [mode]);

  // Listen for system preference changes
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const root = document.documentElement;
      if (mq.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setThemeMode = useCallback((newMode) => {
    if (['light', 'dark', 'system'].includes(newMode)) {
      setMode(newMode);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, isDark, toggleMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme mode context.
 * Must be used inside a <ThemeProvider>.
 */
export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within a <ThemeProvider>');
  }
  return ctx;
}
