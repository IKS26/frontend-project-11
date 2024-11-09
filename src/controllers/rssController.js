import i18next from 'i18next';

import validateRSS from '../utils/validation.js';
import { showModal } from '../views/modalWindow.js';
import { loadRSS, parseRSS, updateRSSFeeds } from '../utils/rssUtils.js';
import { addFeed, getPostById, markPostAsRead } from '../models/model.js';

export const handleRSSSubmit = async (event, state, updateFeedback) => {
  event.preventDefault();
  const url = event.target.url.value.trim();
  const newState = { ...state }; // Копируем объект состояния для изменения

  try {
    const validUrl = await validateRSS(newState.feeds).validate(url);
    const data = await loadRSS(validUrl);
    const parsedData = await parseRSS(data);
    const {
      title,
      description,
      items,
    } = parsedData;

    const feed = { id: Date.now(), url, title, description };
    const posts = items.map((item) => ({
      ...item,
      feedId: feed.id,
    }));

    addFeed(feed, posts, newState);
    newState.feedback = 'rss_added';

    event.target.reset();
  } catch (err) {
    if (err.name === 'ValidationError') {
      const [error] = err.errors;
      newState.feedback = error;
    } else if (err.message === 'network_error') {
      newState.feedback = i18next.t('network_error');
    } else {
      newState.feedback = i18next.t('invalid_rss');
    }
    updateFeedback(newState.feedback);
  }
};

export const startRSSUpdates = (state, addRssToState) => {
  const onNewPosts = (feed, newPosts) => {
    addRssToState(feed, newPosts, state);
  };
  updateRSSFeeds(state, onNewPosts);
};

export function handlePostPreview(postId, state, updatePostClass) {
  const post = getPostById(postId, state);

  if (post) {
    markPostAsRead(postId, state);
    showModal(post.title, post.description, post.link);
    updatePostClass(postId, state);
  }
}
