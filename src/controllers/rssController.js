import showModal from '../views/modalWindow.js';
import { validateRSS } from '../utils/validation.js';
import { loadRSS, parseRSS } from '../utils/rssUtils.js';
import { addFeed, getPostById, markPostAsRead } from '../models/model.js';
import { forceRenderFeedback } from '../views/view.js';

export const handleRSSSubmit = (
  event,
  watchedState,
  setState,
  i18nextInstance,
) => {
  event.preventDefault();
  const form = event.target;
  const urlInput = form.elements.url;
  const submitButton = form.querySelector('button[type="submit"]');
  const url = urlInput.value.trim();

  urlInput.disabled = true;
  submitButton.disabled = true;

  setState({ feedback: '', feedbackType: null });
  urlInput.classList.add('form-control');

  const currentFeeds = watchedState.feeds;

  validateRSS(currentFeeds)
    .validate(url)
    .then(loadRSS)
    .then(parseRSS)
    .then((parsedData) => {
      const { title, description, items } = parsedData;

      const feed = {
        id: Date.now(),
        url,
        title,
        description,
      };

      const posts = items.map((item) => ({
        ...item,
        feedId: feed.id,
        id: `${feed.id}-${item.link}`,
      }));

      addFeed(feed, posts, watchedState);

      setState({
        feedback: i18nextInstance.t('rss_added'),
        feedbackType: 'success',
      });
      forceRenderFeedback(watchedState);
      urlInput.classList.remove('is-invalid');
      form.reset();
    })
    .catch((err) => {
      const feedback = err.name === 'ValidationError'
        ? err.errors[0]
        : i18nextInstance.t(
          err.message === 'network_error' ? 'network_error' : 'invalid_rss',
        );
      setState({ feedback, feedbackType: 'error' });
      forceRenderFeedback(watchedState);
      urlInput.classList.add('is-invalid');
    })
    .finally(() => {
      urlInput.disabled = false;
      submitButton.disabled = false;
    });
};

export const initFormListener = (
  form,
  watchedState,
  setState,
  i18nextInstance,
) => {
  form.addEventListener('submit', (event) => handleRSSSubmit(event, watchedState, setState, i18nextInstance));
};

const updatePostClass = (postId) => {
  const postElement = document
    .querySelector(`button[data-post-id="${postId}"]`)
    .closest('li');
  if (postElement) {
    postElement.querySelector('a').classList.replace('fw-bold', 'fw-normal');
  }
};

export const handlePostPreview = (postId) => {
  const post = getPostById(postId);
  if (post) {
    markPostAsRead(postId);
    showModal(post.title, post.description, post.link);
    updatePostClass(postId);
  }
};

export const attachPostPreviewListener = () => {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('post-preview')) {
      const { postId } = event.target.dataset;
      handlePostPreview(postId);
    }
  });
};
