/**
 * Get age from an ISO dateOfBirth string coming from the backend.
 * Returns null if missing or invalid.
 */
export const getAgeFromDOB = (dob?: string): number | null => {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

/**
 * Check whether an age falls within a range string like "18-20" or "40-45".
 */
export const ageInRange = (age: number | null, range: string): boolean => {
  if (age === null || !range) return true;
  const [min, max] = range.split("-").map(Number);
  return age >= min && age <= max;
};

/**
 * Legacy NIC-based age extractor (kept for reference, not used in feed).
 */
export const getAgeFromNIC = (nic?: string): number | null => {
  if (!nic) return null;

  let year: number;
  let dayOfYear: number;

  const oldNIC = /^(\d{9})[vVxX]$/.exec(nic);
  const newNIC = /^(\d{12})$/.exec(nic);

  if (oldNIC) {
    year      = 1900 + parseInt(nic.substring(0, 2), 10);
    dayOfYear = parseInt(nic.substring(2, 5), 10);
  } else if (newNIC) {
    year      = parseInt(nic.substring(0, 4), 10);
    dayOfYear = parseInt(nic.substring(4, 7), 10);
  } else {
    return null;
  }

  if (dayOfYear > 500) dayOfYear -= 500;

  const birthDate = new Date(year, 0, dayOfYear);
  const today     = new Date();
  let age         = today.getFullYear() - birthDate.getFullYear();
  const m         = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  return age;
};
