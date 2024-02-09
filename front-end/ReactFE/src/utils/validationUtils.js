import * as Yup from 'yup';

import { sanitizeNameAndProvince, sanitizePostalCode, sanitizeEmail, sanitizePhoneNumber } from './sanitizationUtils';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .transform((value) => sanitizeNameAndProvince(value))
    .min(2, 'name must be at least 2 characters')
    .max(50, 'name cannot exceed 50 characters')
    .required('clinic name is required'),
  province: Yup.string()
    .transform((value) => sanitizeNameAndProvince(value))
    .min(2, 'province must be at least 2 characters')
    .max(50, 'province cannot exceed 50 characters')
    .required('province is required'),
  postalCode: Yup.string()
    .transform((value) => sanitizePostalCode(value))
    .matches(/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/, 'invalid postal code')
    .required('postal code is required'),
  contactEmail: Yup.string()
    .transform((value) => sanitizeEmail(value))
    .email('invalid email address')
    .required('email is required'),
  contactPhone: Yup.string()
    .transform((value) => sanitizePhoneNumber(value))
    .matches(/^\+?[1-9]\d{7,14}$/, 'invalid phone number')
    .required('phone number is required'),
});

export default validationSchema;