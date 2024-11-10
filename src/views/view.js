import onChange from 'on-change';
import i18next from 'i18next';

import {
  handleRSSSubmit,
  handlePostPreview,
} from '../controllers/rssController.js';

function renderFeed(feed, container) {
  const containerElement = container;
  containerElement.innerHTML = '';
  const feedElement = document.createElement('li');
  feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');
  feedElement.innerHTML = `
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">${feed.description}</p>
  `;
  containerElement.appendChild(feedElement);
}

function renderPosts(posts, container, state) {
  const containerElement = container;
  containerElement.innerHTML = '';
  posts.forEach((post) => {
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
      <a href="${post.link}" class="${postClass}" data-id="${post.feedId}" target="_blank" rel="noopener noreferrer">${post.title}</a>
      <button type="button" class="post-preview btn btn-outline-primary btn-sm" data-post-id="${post.id}">${i18next.t('preview')}</button>
    `;

    containerElement.appendChild(postElement);
  });

  container.querySelectorAll('.post-preview').forEach((button) => {
    button.addEventListener('click', (event) => {
      const { postId } = event.target.dataset;
      // eslint-disable-next-line no-use-before-define
      handlePostPreview(postId, state, updatePostClass);
    });
  });
}

export function updatePostClass(postId) {
  const postElement = document
    .querySelector(`button[data-post-id="${postId}"]`)
    .closest('li');
  if (postElement) {
    postElement.querySelector('a').classList.replace('fw-bold', 'fw-normal');
  }
}

export function updateFeedback(message, isError = false) {
  const feedbackElement = document.querySelector('.feedback');
  const inputElement = document.getElementById('url-input');

  feedbackElement.textContent = i18next.t(message);
  feedbackElement.classList.toggle('hidden', !message);

  // Удаляем все классы, кроме класса 'feedback'
  feedbackElement.className = 'feedback';
  inputElement.classList.remove('is-invalid');

  if (isError) {
    feedbackElement.classList.add('text-danger');
    inputElement.classList.add('is-invalid');
  } else {
    feedbackElement.classList.add('text-success');
  }
}

export default function initView(state) {
  const form = document.querySelector('.rss-form');
  const feedsContainer = document.querySelector('.feeds .list-group');
  const postsContainer = document.querySelector('.posts .list-group');

  const watchedState = onChange(state, (path, value) => {
    const newState = { ...state };

    if (path === 'feedback') {
      if (value === 'rss_added') {
        updateFeedback('rss_added', false);
        const newFeed = newState.feeds[newState.feeds.length - 1];
        const newPosts = newState.posts.filter(
          (post) => post.feedId === newFeed.id,
        );

        renderFeed(newFeed, feedsContainer);
        renderPosts(newPosts, postsContainer, newState);

        newState.feedback = '';
      } else {
        updateFeedback(value, true);
        newState.feedback = '';
      }
    }
  });

  form.addEventListener('submit', (event) => {
    console.log('Форма отправлена');
    handleRSSSubmit(event, watchedState, updateFeedback);
  });
}
