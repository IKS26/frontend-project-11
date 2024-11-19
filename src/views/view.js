import onChange from 'on-change';

const renderTitle = (containerSelector, titleText) => {
  const container = document.querySelector(containerSelector);
  if (!container.querySelector('.card-title')) {
    const titleElement = document.createElement('div');
    titleElement.classList.add('card-body');
    titleElement.innerHTML = `<h2 class="card-title h4">${titleText}</h2>`;
    container.prepend(titleElement);
  }
};

const renderFeedsTitle = () => renderTitle('.feeds .card', 'RSS-каналы');
const renderPostsTitle = () => renderTitle('.posts .card', 'Посты');

const renderFeed = (feed, feedsContainer) => {
  renderFeedsTitle();
  const feedElement = document.createElement('li');
  feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');
  feedElement.innerHTML = `
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">${feed.description}</p>
  `;
  feedsContainer.prepend(feedElement);
};

export const renderPosts = (posts, state, i18nextInstance) => {
  renderPostsTitle();
  const postsContainer = document.querySelector('.posts .list-group');

  const sortedPosts = [...posts].reverse();

  sortedPosts.forEach((post) => {
    const existingPost = postsContainer.querySelector(`button[data-post-id="${post.id}"]`);
    if (existingPost) return;

    const postElement = document.createElement('li');
    postElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const postClass = state.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold';
    postElement.innerHTML = `
      <a href="${post.link}" class="${postClass}" target="_blank" rel="noopener noreferrer">${post.title}</a>
      <button type="button" class="post-preview btn btn-outline-primary btn-sm" data-post-id="${post.id}">${i18nextInstance.t('preview')}</button>
    `;

    postsContainer.prepend(postElement);
  });
};

const renderFeedback = (feedback, feedbackElement, type = 'success') => {
  // eslint-disable-next-line no-param-reassign
  feedbackElement.textContent = feedback || '';
  feedbackElement.classList.toggle('d-none', !feedback);
  feedbackElement.classList.toggle('text-danger', type !== 'success');
  feedbackElement.classList.toggle('text-success', type === 'success');
};

export const forceRenderFeedback = (state) => {
  const feedbackElement = document.querySelector('.feedback');
  const feedbackType = state.feedbackType || 'error';
  renderFeedback(state.feedback, feedbackElement, feedbackType);
};

export default (state, i18nextInstance) => {
  const feedsContainer = document.querySelector('.feeds .list-group');
  const feedbackElement = document.querySelector('.feedback');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'feeds') {
      const newFeed = state.feeds[state.feeds.length - 1];
      renderFeed(newFeed, feedsContainer);
    }

    if (path === 'posts') {
      renderPosts(state.posts, state, i18nextInstance);
    }

    if (path === 'feedback') {
      renderFeedback(value, feedbackElement, state.feedbackType || 'error');
    }
  });

  return { watchedState };
};
