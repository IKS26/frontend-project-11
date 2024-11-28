import onChange from 'on-change';
import { renderFeed, renderPosts } from './renders.js';

export const domElements = {
  form: document.querySelector('.rss-form'),
  inputField: document.querySelector('#url-input'),
  addButton: document.querySelector('.rss-form button[type="submit"]'),
  feedback: document.querySelector('.feedback'),
};

export default (state, i18nextInstance) => {
  const feedsContainer = document.querySelector('.feeds .list-group');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'feeds') {
      const newFeed = value[value.length - 1];
      renderFeed(newFeed, feedsContainer);
    }

    if (path === 'posts') {
      renderPosts(state.posts, state, i18nextInstance);
    }
  });

  return watchedState;
};
