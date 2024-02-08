
/* trims whitespace and removes special characters except for basic punctuation */
export const sanitizeNameAndProvince = (input) => {
  return input.trim().replace(/[^a-zA-Z0-9\s,.'-]/g, '');
};
  
/* standardizes postal codes by uppercase and removing unnecessary spaces/dashes */
export const sanitizePostalCode = (postalCode) => {
  return postalCode.toUpperCase().replace(/\s+/g, '').replace(/-/g, '');
};
  
export const sanitizeEmail = (email) => {
  return email.trim();
};
  
export const sanitizePhoneNumber = (phone) => {
  return phone.replace(/[^\d+]/g, '');
};
  