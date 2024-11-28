import * as yup from 'yup';

yup.setLocale({
  string: {
    required: 'empty_field',
    url: 'error_invalid_url',
  },
  mixed: {
    notOneOf: 'error_duplicate',
  },
});

const validateForm = (url, existingUrls) => {
  const schema1 = yup.string().required().url();
  const schema2 = yup.mixed().notOneOf(existingUrls);

  try {
    schema1.validateSync(url);
    schema2.validateSync(url);
    return null;
  } catch (error) {
    return error.message;
  }
};

export default validateForm;
