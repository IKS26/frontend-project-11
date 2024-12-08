/* eslint-disable no-param-reassign */
import onChange from 'on-change';

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

const updateFormState = (
  state,
  domElements,
  i18nextInstance,
  isFocus = true,
) => {
  const { form } = state;
  const { inputField, feedback } = domElements;

  const hasError = !form.isValid;

  inputField.classList.toggle('is-invalid', hasError);

  feedback.textContent = i18nextInstance.t(form.error);
  feedback.classList.toggle('text-danger', hasError);
  feedback.classList.toggle('text-success', form.isValid);

  if (isFocus) {
    inputField.focus();
  }
};

const handleLoadingProcess = (state, domElements, i18nextInstance) => {
  const { loadingProcess } = state;
  const {
    inputField, addButton, feedback, form,
  } = domElements;

  switch (loadingProcess.status) {
    case 'idle':
      formControl.enable(inputField, addButton);
      updateFormState(state, domElements, i18nextInstance);
      break;

    case 'loading':
      formControl.disable(inputField, addButton);
      updateFormState(state, domElements, i18nextInstance, false);
      break;

    case 'success':
      formControl.enable(inputField, addButton);
      inputField.classList.remove('border-danger');
      feedback.textContent = i18nextInstance.t('rss_added');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      form.reset();
      break;

    case 'fail':
      formControl.enable(inputField, addButton);
      inputField.classList.add('border-danger');
      feedback.textContent = i18nextInstance.t(loadingProcess.error);
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      break;

    default:
      console.error(`Unknown loading process state: ${loadingProcess.status}`);
  }
};

const renderFeed = (state, domElements, i18nextInstance) => {
  domElements.feeds.innerHTML = '';

  const titleElement = document.createElement('div');
  titleElement.classList.add('card-body');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18nextInstance.t('feeds');
  titleElement.prepend(title);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach((feed) => {
    const feedItem = document.createElement('li');
    feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;

    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = feed.description;

    feedItem.append(feedTitle, feedDescription);
    feedsList.prepend(feedItem);
  });

  domElements.feeds.append(titleElement, feedsList);
};

const renderPosts = (state, domElements, i18nextInstance) => {
  domElements.posts.innerHTML = '';

  const titleElement = document.createElement('div');
  titleElement.classList.add('card-body');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18nextInstance.t('posts');
  titleElement.prepend(title);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  const postsCopy = [...state.posts].reverse();
  postsCopy.forEach((post) => {
    const postElement = document.createElement('li');
    postElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const postLink = document.createElement('a');
    postLink.href = post.link;
    postLink.textContent = post.title;
    postLink.classList.add(
      state.ui.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold',
    );
    postLink.target = '_blank';
    postLink.rel = 'noopener noreferrer';
    postLink.dataset.postId = post.id;

    const previewButton = document.createElement('button');
    previewButton.type = 'button';
    previewButton.textContent = i18nextInstance.t('preview');
    previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    previewButton.dataset.postId = post.id;
    previewButton.dataset.bsToggle = 'modal';
    previewButton.dataset.bsTarget = '#modal';

    postElement.append(postLink, previewButton);
    postsList.prepend(postElement);
  });

  domElements.posts.prepend(titleElement);
  domElements.posts.append(postsList);
};

const renderModal = (state, domElements, i18nextInstance) => {
  const modalElement = domElements.modal;
  const modalTitle = modalElement.querySelector('.modal-title');
  const modalBody = modalElement.querySelector('.modal-body');
  const fullArticleButton = modalElement.querySelector('.full-article');
  const closeButton = modalElement.querySelector('.close');

  fullArticleButton.textContent = i18nextInstance.t('full_article');
  closeButton.textContent = i18nextInstance.t('close');

  const { postId } = state.ui.modal;
  const selectedPost = state.posts.find((post) => post.id === postId);

  if (!selectedPost) return;

  modalTitle.textContent = selectedPost.title;
  modalBody.textContent = selectedPost.description;
  fullArticleButton.href = selectedPost.link;
};

const initView = (state, domElements, i18nextInstance) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'feeds':
        renderFeed(state, domElements, i18nextInstance);
        break;

      case 'posts':
      case 'ui.readPosts':
        renderPosts(state, domElements, i18nextInstance);
        break;

      case 'form':
      case 'form.isValid':
        updateFormState(state, domElements, i18nextInstance);
        break;

      case 'loadingProcess.error':
      case 'loadingProcess.status':
        handleLoadingProcess(state, domElements, i18nextInstance);
        break;

      case 'ui.modal.postId':
        renderModal(state, domElements, i18nextInstance);
        break;

      default:
        break;
    }
  });

  return watchedState;
};

export default initView;
