import { sanitizeNameAndProvince, sanitizePostalCode, sanitizeEmail, sanitizePhoneNumber } from '../utils/sanitizationUtils.js'

describe('Sanitization Utils', () => {
  describe('sanitizeNameAndProvince', () => {
    it('should trim whitespace and remove special characters except for basic punctuation', () => {
      const input = '  John$Doe!! ';
      const sanitized = sanitizeNameAndProvince(input);
      expect(sanitized).toBe('JohnDoe');
    });

    it('should return empty string if input is empty', () => {
      const input = '';
      const sanitized = sanitizeNameAndProvince(input);
      expect(sanitized).toBe('');
    });
  });

  describe('sanitizePostalCode', () => {
    it('should standardize postal codes by uppercase and remove unnecessary spaces/dashes', () => {
      const postalCode = 'a1B 2c3-D';
      const sanitized = sanitizePostalCode(postalCode);
      expect(sanitized).toBe('A1B2C3D');
    });

    it('should return empty string if input is empty', () => {
      const postalCode = '';
      const sanitized = sanitizePostalCode(postalCode);
      expect(sanitized).toBe('');
    });
  });

  describe('sanitizeEmail', () => {
    it('should trim whitespace from email', () => {
      const email = '  john@example.com ';
      const sanitized = sanitizeEmail(email);
      expect(sanitized).toBe('john@example.com');
    });

    it('should return empty string if input is empty', () => {
      const email = '';
      const sanitized = sanitizeEmail(email);
      expect(sanitized).toBe('');
    });
  });

  describe('sanitizePhoneNumber', () => {
    it('should remove non-digit characters from phone number', () => {
      const phone = '+1 (123) 456-7890';
      const sanitized = sanitizePhoneNumber(phone);
      expect(sanitized).toBe('+11234567890');
    });

    it('should return empty string if input is empty', () => {
      const phone = '';
      const sanitized = sanitizePhoneNumber(phone);
      expect(sanitized).toBe('');
    });
  });
});
