import { validateRSS } from '../utils/validation.js';
import { loadRSS, parseRSS } from '../utils/rssUtils.js';
import { addRss } from '../models/model.js';

export const handleRSSSubmit = (event, state) => {
  event.preventDefault();
  const url = event.target.url.value.trim();

  console.log('Submitting URL:', url);
  console.log(
    'Current feeds:',
    state.feeds.map((feed) => feed.url),
  ); // Логируем только URL

  validateRSS(state.feeds)
    .validate(url)
    .then((validUrl) => loadRSS(validUrl))
    .then((data) => parseRSS(data))
    .then((parsedData) => {
      const { title, description, items } = parsedData;
      const feed = { id: Date.now(), url, title, description };
      const posts = items.map((item) => ({ ...item, feedId: feed.id }));

      if (!Array.isArray(state.feeds)) {
        state.feeds = [];
      }
      if (!Array.isArray(state.posts)) {
        state.posts = [];
      }

      addRss(feed, posts, state);
      event.target.reset();
    })
    .catch((err) => {
      console.log('Validation error caught:', err);

      if (err.name === 'ValidationError') {
        console.log('Validation error details:', err.errors);
        state.feedback = err.errors[0]; // Сообщение об ошибке из yup
      } else if (err.message === 'network_error') {
        state.feedback = 'Network error occurred';
      } else {
        state.feedback = 'Parsing error';
      }
    });
};
