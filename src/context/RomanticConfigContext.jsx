import { createContext, useContext } from 'react';
import { surpriseConfig } from '../data/surpriseConfig';

/**
 * React context for romantic birthday story configuration.
 * Allows custom configuration created via the Romantic Creator form
 * to be accessed by all slides and layers.
 */
const RomanticConfigContext = createContext(surpriseConfig);

export function RomanticConfigProvider({ config, children }) {
  return (
    <RomanticConfigContext.Provider value={config || surpriseConfig}>
      {children}
    </RomanticConfigContext.Provider>
  );
}

/**
 * Custom hook to access romantic story configuration.
 * Returns custom config from RomanticConfigProvider, or default surpriseConfig.
 */
export function useRomanticConfig() {
  const context = useContext(RomanticConfigContext);
  return context || surpriseConfig;
}

export default RomanticConfigContext;
