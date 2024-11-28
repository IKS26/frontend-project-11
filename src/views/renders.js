import bootstrap from '../assets/bootstrap.js';

export const renderTitle = (containerSelector, titleText) => {
  const container = document.querySelector(containerSelector);
  if (!container.querySelector('.card-title')) {
    const titleElement = document.createElement('div');
    titleElement.classList.add('card-body');
    titleElement.innerHTML = `<h2 class="card-title h4">${titleText}</h2>`;
    container.prepend(titleElement);
  }
};

export const renderFeedsTitle = () => renderTitle('.feeds .card', 'RSS-каналы');
export const renderPostsTitle = () => renderTitle('.posts .card', 'Посты');

export const renderFeed = (feed, feedsContainer) => {
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
    const existingPost = postsContainer.querySelector(
      `button[data-post-id="${post.id}"]`,
    );
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

    const postClass = state.ui.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold';
    postElement.innerHTML = `
      <a href="${post.link}" class="${postClass}" target="_blank" rel="noopener noreferrer">${post.title}</a>
      <button type="button" class="post-preview btn btn-outline-primary btn-sm" data-post-id="${post.id}">${i18nextInstance.t('preview')}</button>
    `;

    postsContainer.prepend(postElement);
  });
};

let modalInstance;
export const renderModal = (title, description, link) => {
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

  modalInstance.show();
};
