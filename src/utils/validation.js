import * as yup from 'yup';
import i18next from 'i18next';

yup.setLocale({
  string: {
    url: () => i18next.t('error_invalid_url'),
  },
  mixed: {
    notOneOf: () => i18next.t('error_duplicate'),
  },
});

export function validateRSS(existingFeeds) {
  // Преобразуем Proxy обратно в массив и извлекаем только URL
  const feeds = existingFeeds.map(feed => feed.url);
  console.log('Validating URL against feeds:', feeds);

  return yup.string()
    .url()
    .notOneOf(feeds, i18next.t('error_duplicate')); // Используем только URL для проверки
}

