import i18next from 'i18next';

import validateRSS from '../utils/validation.js';
import { showModal } from '../views/modalWindow.js';
import { loadRSS, parseRSS } from '../utils/rssUtils.js';
import { addFeed, getPostById, markPostAsRead } from '../models/model.js';

export const handleRSSSubmit = (event, state, updateFeedback) => {
  event.preventDefault();
  const url = event.target.elements.url.value.trim();

  validateRSS(state.feeds)
    .validate(url)
    .then((validUrl) => loadRSS(validUrl))
    .then((data) => parseRSS(data))
    .then((parsedData) => {
      const { title, description, items } = parsedData;

      const feed = {
        id: Date.now(),
        url,
        title,
        description,
      };
      const posts = items.map((item, index) => ({
        ...item,
        feedId: feed.id,
        id: `${feed.id}-${index}`,
      }));

      addFeed(feed, posts, state);
      // eslint-disable-next-line no-param-reassign
      state.feedback = 'rss_added';
      updateFeedback('rss_added', false);

      event.target.reset();
    })
    .catch((err) => {
      const feedbackMessage = err.name === 'ValidationError'
        ? err.errors[0]
        : i18next.t(
          err.message === 'network_error' ? 'network_error' : 'invalid_rss',
        );
      // eslint-disable-next-line no-param-reassign
      state.feedback = feedbackMessage;
      updateFeedback(feedbackMessage, true);
    });
};

export function handlePostPreview(postId, state, updatePostClass) {
  const post = getPostById(postId, state);

  if (post) {
    markPostAsRead(postId, state);
    showModal(post.title, post.description, post.link);
    updatePostClass(postId);
  }
}
