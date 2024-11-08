import { loadRSS, parseRSS, updateRSSFeeds } from '../utils/rssUtils.js';
import { validateRSS } from '../utils/validation.js';
import { showModal, hideModal, updatePostClass } from '../views/view.js';
import { addRss, getPostById, markPostAsRead } from '../models/model.js';

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
      event.target.reset();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        state.feedback = err.errors[0];
      } else if (err.message === 'network_error') {
        state.feedback = 'Network error occurred';
      } else {
        state.feedback = 'Parsing error';
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
