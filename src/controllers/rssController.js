import i18next from 'i18next';

import validateRSS from '../utils/validation.js';
import { showModal } from '../views/modal.js';
import { loadRSS, parseRSS, updateRSSFeeds } from '../utils/rssUtils.js';
import { addRss, getPostById, markPostAsRead } from '../models/model.js';

export const handleRSSSubmit = async (event, state, updateFeedback) => {
  event.preventDefault();
  const url = event.target.url.value.trim();

  try {
    const validUrl = await validateRSS(state.feeds).validate(url);
    const data = await loadRSS(validUrl);
    const parsedData = await parseRSS(data);
    const { title, description, items } = parsedData;

    const feed = { id: Date.now(), url, title, description };
    const posts = items.map((item) => ({ ...item, feedId: feed.id }));

    addRss(feed, posts, state);
    state.feedback = 'rss_added';

    event.target.reset();
  } catch (err) {
    if (err.name === 'ValidationError') {
      const [error] = err.errors;
      state.feedback = error;
    } else if (err.message === 'network_error') {
      state.feedback = i18next.t('network_error');
    } else {
      state.feedback = i18next.t('invalid_rss');
    }
    updateFeedback(state.feedback);
  }
};

export const startRSSUpdates = (state, addRss) => {
  const onNewPosts = (feed, newPosts) => {
    addRss(feed, newPosts, state);
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
