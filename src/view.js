/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import bootstrap from './assets/bootstrap.js';

const updateFeedback = (feedbackElement, message, isSuccess = false) => {
  feedbackElement.textContent = message;
  feedbackElement.classList.toggle('text-danger', !isSuccess);
  feedbackElement.classList.toggle('text-success', isSuccess);
};

const updateInputFieldValidation = (inputField, isValid = true) => {
  inputField.classList.toggle('is-invalid', !isValid);
};

const updateFormState = (form, domElements, i18nextInstance, focus = true) => {
  const { inputField, feedback } = domElements;
  if (!inputField || !feedback) return;

  updateInputFieldValidation(inputField, form.isValid);
  updateFeedback(feedback, i18nextInstance.t(form.error), form.isValid);
  if (focus) inputField.focus();
};

const formControl = {
  disable: (inputField, addButton) => {
    inputField.readOnly = true;
    addButton.disabled = true;
  },
  enable: (inputField, addButton) => {
    inputField.readOnly = false;
    addButton.disabled = false;
  },
};

const handleLoadingProcess = (loadingProcess, domElements, i18nextInstance) => {
  const {
    inputField, addButton, feedback, form,
  } = domElements;

  if (!inputField || !addButton || !feedback || !form) {
    console.error('Missing required DOM elements in handleLoadingProcess.');
    return;
  }

  switch (loadingProcess.status) {
    case 'idle':
      formControl.enable(inputField, addButton);
      inputField.focus();
      break;
    case 'loading':
      formControl.disable(inputField, addButton);
      updateFormState(form, domElements, i18nextInstance);
      break;
    case 'success':
      formControl.enable(inputField, addButton);
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = loadingProcess.error;
      form.reset();
      break;
    case 'fail':
      formControl.enable(inputField, addButton);
      updateFormState(form, domElements, i18nextInstance, false);
      inputField.classList.add('border-danger');
      break;
    default:
      console.error(`Unknown loading process state: ${loadingProcess.status}`);
  }
};

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

const renderFeed = (feeds, feedsContainer) => {
  renderFeedsTitle();
  feedsContainer.innerHTML = '';
  feeds.forEach((feed) => {
    const feedElement = document.createElement('li');
    feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');
    feedElement.innerHTML = `
      <h3 class="h6 m-0">${feed.title}</h3>
      <p class="m-0 small text-black-50">${feed.description}</p>
    `;
    feedsContainer.prepend(feedElement);
  });
};

const renderedPosts = new Set();

const renderPosts = (posts, state, i18nextInstance) => {
  renderPostsTitle();
  const postsContainer = document.querySelector('.posts .list-group');

  const newPosts = posts.filter((post) => !renderedPosts.has(post.id));

  newPosts.reverse().forEach((post) => {
    const postElement = document.createElement('li');
    postElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const postClass = state.ui.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold';
    postElement.innerHTML = `
      <a href="${post.link}" class="${postClass}" target="_blank" rel="noopener noreferrer">${post.title}</a>
      <button type="button" class="post-preview btn btn-outline-primary btn-sm" data-post-id="${post.id}">${i18nextInstance.t('preview')}</button>
    `;

    postsContainer.prepend(postElement);
    renderedPosts.add(post.id);
  });
};

const updatePostClass = (postId) => {
  const postElement = document
    .querySelector(`button[data-post-id="${postId}"]`)
    ?.closest('li');
  if (postElement) {
    const link = postElement.querySelector('a');
    if (link) {
      link.classList.replace('fw-bold', 'fw-normal');
    }
  }
};

const renderModal = (title, description, link, postId) => {
  let modalInstance;
  const modalElement = document.getElementById('modal');
  const modalTitle = modalElement.querySelector('.modal-title');
  const modalBody = modalElement.querySelector('.modal-body');
  const fullArticleButton = modalElement.querySelector('.full-article');

  modalTitle.textContent = title;
  modalBody.textContent = description;
  fullArticleButton.href = link;

  if (!modalInstance) {
    modalInstance = new bootstrap.Modal(modalElement);
  }

  updatePostClass(postId);
  modalInstance.show();
};

const initView = (state, domElements, i18nextInstance) => {
  const watchedState = onChange(state, (path) => {
    switch (true) {
      case path === 'feeds':
        renderFeed(state.feeds, domElements.feedsContainer);
        break;
      case path === 'posts':
        renderPosts(state.posts, state, i18nextInstance);
        break;
      case path.startsWith('form'):
        updateFormState(state.form, domElements, i18nextInstance);
        break;
      case path.startsWith('loadingProcess'):
        handleLoadingProcess(
          state.loadingProcess,
          domElements,
          i18nextInstance,
        );
        break;
      default:
        break;
    }
  });

  return watchedState;
};

export { renderPosts, renderModal };

export default initView;
