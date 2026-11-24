/**
 * Small, dependency-free device probe used to keep the decorative layers
 * cheap on phones. Reading these values is synchronous and happens once, so
 * the story never re-renders just because the device profile was checked.
 */
let cachedProfile = null;

export function getDeviceProfile() {
  if (cachedProfile) return cachedProfile;

  if (typeof window === 'undefined') {
    cachedProfile = {
      isMobile: false,
      isLowPower: false,
      reduceAmbient: false,
      ambientScale: 1,
    };
    return cachedProfile;
  }

  const coarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;
  const narrowScreen =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 820px)').matches
      : window.innerWidth <= 820;

  const isMobile = coarsePointer || narrowScreen;
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  const isLowPower = isMobile ? cores <= 4 || memory <= 4 : cores <= 2;

  cachedProfile = {
    isMobile,
    isLowPower,
    // Phones get the same story, just fewer stars, particles and GPU effects.
    reduceAmbient: isMobile || isLowPower,
    ambientScale: isLowPower ? 0.22 : isMobile ? 0.36 : 1,
  };

  return cachedProfile;
}

/** Scale a decorative element count without ever making a layer look empty. */
export function ambientCount(count, minimum = 12) {
  const { ambientScale } = getDeviceProfile();
  return Math.max(minimum, Math.round(count * ambientScale));
}

export default getDeviceProfile;
