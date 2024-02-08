import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'name must be at least 2 characters')
    .max(50, 'name cannot exceed 50 characters')
    .required('clinic name is required'),
  province: Yup.string()
  /* this should be drop down returns from user so this may be unnecessary */
    .min(2, 'province must be at least 2 characters')
    .max(50, 'province cannot exceed 50 characters')
    .required('province is required'),
  postalCode: Yup.string()
    .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'invalid postal code')
    .required('postal code is required'),
  contactEmail: Yup.string()
    .email('invalid email address')
    .required('email is required'),
  contactPhone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'invalid phone number')
    .required('phone number is required'),
});

export default validationSchema;
