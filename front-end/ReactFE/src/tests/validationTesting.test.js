import validationUtils from '../utils/validationUtils'



describe('Validation Schema Tests', () => {
  describe('Name Field', () => {
    const validNames = ['Clinic A', "O'Connor's", 'Therapy Center'];
    const invalidNames = ['', 'A', '!@#$%^&*()'];

    test.each(validNames)('"%s" is a valid name', async (name) => {
      await expect(validationUtils.validateAt('name', { name })).resolves.toBe(name);
    });

    test.each(invalidNames)('"%s" is an invalid name', async (name) => {
      await expect(validationUtils.validateAt('name', { name })).rejects.toThrow();
    });
  });

  describe('Province Field', () => {
    const validProvinces = ['ON', 'Quebec', 'British Columbia'];
    const invalidProvinces = ['', 'X', '1'];

    test.each(validProvinces)('"%s" is a valid province', async (province) => {
      await expect(validationUtils.validateAt('province', { province })).resolves.toBe(province);
    });

    test.each(invalidProvinces)('"%s" is an invalid province', async (province) => {
      await expect(validationUtils.validateAt('province', { province })).rejects.toThrow();
    });
  });

  describe('Postal Code Field', () => {
    const validPostalCodes = ['M5V 3L9', 'V6B 2T4'];
    const invalidPostalCodes = ['ABCDE', '12345', 'M5V3L9Z'];

    test.each(validPostalCodes)('"%s" is a valid postal code', async (postalCode) => {
      await expect(validationUtils.validateAt('postalCode', { postalCode })).resolves.toBe(postalCode.replace(/\s+/g, ''));
    });

    test.each(invalidPostalCodes)('"%s" is an invalid postal code', async (postalCode) => {
      await expect(validationUtils.validateAt('postalCode', { postalCode })).rejects.toThrow();
    });
  });

  describe('Contact Email Field', () => {
    const validEmails = ['email@example.com', 'first.last@example.co.uk'];
    const invalidEmails = ['@example.com', 'invalid-email', 'user@example,com'];

    test.each(validEmails)('"%s" is a valid email', async (email) => {
      await expect(validationUtils.validateAt('contactEmail', { contactEmail: email })).resolves.toBe(email);
    });

    test.each(invalidEmails)('"%s" is an invalid email', async (email) => {
      await expect(validationUtils.validateAt('contactEmail', { contactEmail: email })).rejects.toThrow();
    });
  });

  describe('Contact Phone Field', () => {
    const validPhones = [
        { raw: '3062621723', sanitized: '3062621723' },
        { raw: '604.822.2848', sanitized: '6048222848' }
    ];
    const invalidPhones = ['12345', 'abcdefghi', '12345283967489126394781623'];
    test.each(validPhones)('"%s" is a valid phone number', async ({raw, sanitized}) => {
        await expect(validationUtils.validateAt('contactPhone', { contactPhone: raw })).resolves.toBe(sanitized);
    });

    test.each(invalidPhones)('"%s" is an invalid phone number', async (phone) => {
        await expect(validationUtils.validateAt('contactPhone', { contactPhone: phone })).rejects.toThrow();
    });
});

});
