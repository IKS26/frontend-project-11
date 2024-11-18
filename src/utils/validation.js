import * as yup from 'yup';

export const configureValidation = (i18nextInstance) => {
  yup.setLocale({
    string: {
      url: () => i18nextInstance.t('error_invalid_url'),
    },
    mixed: {
      notOneOf: () => i18nextInstance.t('error_duplicate'),
    },
  });
};

export const validateRSS = (feeds = []) => {
  const feedUrls = feeds.map((feed) => feed.url);
  return yup.string().url().notOneOf(feedUrls);
};
