import bootstrap from '../assets/bootstrap.js';
import onChange from 'on-change';
import i18next from 'i18next';
import {
  handleRSSSubmit,
  handlePostPreview,
} from '../controllers/rssController.js';

function renderFeed(feed, container) {
  const feedElement = document.createElement('li');
  feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');

  feedElement.innerHTML = `
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">${feed.description}</p>
  `;
  container.appendChild(feedElement);
}

function renderPosts(posts, container, state) {
  container.innerHTML = ''; // Очистка контейнера перед рендерингом новых постов

  posts.forEach((post) => {
    const postElement = document.createElement('li');
    postElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0'
    );

    const postClass = state.readPosts.has(post.id) ? 'fw-normal' : 'fw-bold';

    postElement.innerHTML = `
      <a href="${post.link}" class="${postClass}" data-id="${post.feedId}" target="_blank" rel="noopener noreferrer">${post.title}</a>
      <button type="button" class="post-preview btn btn-outline-primary btn-sm" data-post-id="${post.id}">${i18next.t('preview')}</button>
    `;

    container.appendChild(postElement);
  });

  container.querySelectorAll('.post-preview').forEach((button) => {
    button.addEventListener('click', (event) => {
      const postId = event.target.dataset.postId;
      handlePostPreview(postId, state);
    });
  });
}

function showSuccess(feedbackElement, inputElement, message) {
  feedbackElement.textContent = i18next.t(message);
  feedbackElement.classList.add('text-success');
  feedbackElement.classList.remove('text-danger');
  inputElement.classList.remove('is-invalid');
}

function showError(feedbackElement, inputElement, message) {
  feedbackElement.textContent = i18next.t(message);
  feedbackElement.classList.add('text-danger');
  feedbackElement.classList.remove('text-success');
  inputElement.classList.add('is-invalid');
}

export function updateFeedback(message) {
  const feedbackElement = document.querySelector('.feedback');
  feedbackElement.textContent = message;
  feedbackElement.classList.toggle('hidden', !message);
}

export function showModal(title, description, link) {
  const modalElement = document.getElementById('modal');
  const modalTitle = modalElement.querySelector('.modal-title');
  const modalBody = modalElement.querySelector('.modal-body');
  const fullArticleButton = modalElement.querySelector('.full-article');

  modalTitle.textContent = title;
  modalBody.textContent = description;
  fullArticleButton.href = link;

  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

export function hideModal() {
  const modalElement = document.getElementById('modal');

  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) {
    modal.hide();
  }
}

export function updatePostClass(postId) {
  const postElement = document
    .querySelector(`button[data-post-id="${postId}"]`)
    .closest('li');
  const linkElement = postElement.querySelector('a');
  if (linkElement) {
    linkElement.classList.remove('fw-bold');
    linkElement.classList.add('fw-normal');
  }
}

export default function initView(state) {
  const form = document.querySelector('.rss-form');
  const feedbackElement = document.querySelector('.feedback');
  const inputElement = document.getElementById('url-input');
  const feedsContainer = document.querySelector('.feeds .list-group');
  const postsContainer = document.querySelector('.posts .list-group');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'feedback') {
      if (value === 'rss_added') {
        showSuccess(feedbackElement, inputElement, 'rss_added');
        const newFeed = state.feeds[state.feeds.length - 1];
        const newPosts = state.posts.filter(
          (post) => post.feedId === newFeed.id
        );
        renderFeed(newFeed, feedsContainer);
        renderPosts(newPosts, postsContainer, state);
        state.feedback = ''; // Очистка feedback после отображения
      } else {
        showError(feedbackElement, inputElement, value);
      }
    }
  });

  form.addEventListener('submit', (event) =>
    handleRSSSubmit(event, watchedState)
  );
  return watchedState;
}
