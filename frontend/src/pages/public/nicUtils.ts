
export const getAgeFromDOB = (dob?: string): number | null => {
  if (!dob) return null;
  
  try {
    const birth = new Date(dob);
    
    // ✅ FIX: Validate date is valid
    if (isNaN(birth.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    
    // Adjust if birthday hasn't occurred this year
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    // ✅ FIX: Validate age is reasonable (between 15 and 120)
    if (age < 15 || age > 120) return null;
    
    return age;
  } catch {
    return null;
  }
};


export const ageInRange = (age: number | null, range: string): boolean => {

  if (age === null || age === undefined || !range) {
    return false; // Don't include if age is missing and filter is active
  }
  
  try {
    const [min, max] = range.split("-").map(Number);
    
    
    if (isNaN(min) || isNaN(max)) return false;
    
    return age >= min && age <= max;
  } catch {
    return false;
  }
};


export const getAgeFromNIC = (nic?: string): number | null => {
  if (!nic) return null;

  try {
    let year: number;
    let dayOfYear: number;

  
    const oldNIC = /^(\d{9})[vVxX]$/.exec(nic?.trim() || "");
    const newNIC = /^(\d{12})$/.exec(nic?.trim() || "");

    if (oldNIC) {
     
      year = 1900 + parseInt(nic.substring(0, 2), 10);
      dayOfYear = parseInt(nic.substring(2, 5), 10);
      
    
      if (year < 1900 || year > new Date().getFullYear()) return null;
    } else if (newNIC) {
   
      year = parseInt(nic.substring(0, 4), 10);
      dayOfYear = parseInt(nic.substring(4, 7), 10);
      
      
      if (year < 1900 || year > new Date().getFullYear()) return null;
    } else {
      return null; 
    }

    
    if (dayOfYear > 500) dayOfYear -= 500;

   
    if (dayOfYear < 1 || dayOfYear > 366) return null;

    const birthDate = new Date(year, 0, dayOfYear);
    const today = new Date();
    
  
    if (isNaN(birthDate.getTime())) return null;

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 15 || age > 120) return null;

    return age;
  } catch {
    return null;
  }
};


export const getAgeFromData = (data: {
  age?: number | null;
  dateOfBirth?: string;
  nic?: string;
}): number | null => {
  
  if (data.age !== null && data.age !== undefined) {
    if (data.age >= 15 && data.age <= 120) {
      return data.age;
    }
  }

 
  if (data.dateOfBirth) {
    const ageFromDOB = getAgeFromDOB(data.dateOfBirth);
    if (ageFromDOB !== null) return ageFromDOB;
  }

 
  if (data.nic) {
    const ageFromNIC = getAgeFromNIC(data.nic);
    if (ageFromNIC !== null) return ageFromNIC;
  }

  return null;
};


export const formatDateOfBirth = (dob?: string): string | null => {
  if (!dob) return null;
  
  try {
    const date = new Date(dob);
    
    if (isNaN(date.getTime())) return null;
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
};
