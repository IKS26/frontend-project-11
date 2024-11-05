import { validateRSS } from '../utils/validation.js';
import { addRss } from '../models/model.js';

export const handleRSSSubmit = (event, state) => {
  event.preventDefault();
  const url = event.target.url.value.trim();

  validateRSS(state.feeds)
    .validate(url)
    .then((validUrl) => {
      addRss(validUrl, state);
      state.feedback = 'rss_added';
      event.target.reset();
    })
    .catch((err) => {
      state.feedback = err.errors[0];  // Устанавливаем ключ ошибки для i18next
    });
};
