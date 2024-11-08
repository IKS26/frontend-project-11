import { loadRSS, parseRSS, updateRSSFeeds } from '../utils/rssUtils.js';
import { validateRSS } from '../utils/validation.js';
import { showModal, hideModal, updatePostClass } from '../views/view.js';
import { addRss, getPostById, markPostAsRead } from '../models/model.js';
import i18next from 'i18next';

export const handleRSSSubmit = (event, state) => {
  event.preventDefault();
  const url = event.target.url.value.trim();

  validateRSS(state.feeds)
    .validate(url)
    .then((validUrl) => loadRSS(validUrl))
    .then((data) => parseRSS(data))
    .then((parsedData) => {
      const { title, description, items } = parsedData;
      const feed = { id: Date.now(), url, title, description };
      const posts = items.map((item) => ({ ...item, feedId: feed.id }));
      addRss(feed, posts, state);
      state.feedback = i18next.t('rss_added');
      event.target.reset();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        state.feedback = err.errors[0];
      } else if (err.message === 'network_error') {
        state.feedback = i18next.t('network_error');
      } else {
        state.feedback = i18next.t('invalid_rss');
      }
    });
};

export const startRSSUpdates = (state) => {
  const onNewPosts = (feed, newPosts) => {
    addRss(feed, newPosts, state);
  };
  updateRSSFeeds(state, onNewPosts);
};

// Функция для открытия модального окна
export function handlePostPreview(postId, state) {
  const post = getPostById(postId, state);

  if (post) {
    markPostAsRead(postId, state); // Пометка поста как прочитанный
    showModal(post.title, post.description, post.link);
    updatePostClass(postId, state); // Обновляем класс ссылки
  }
}

export function closeModal() {
  hideModal();
}
