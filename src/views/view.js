import onChange from 'on-change';
import i18next from 'i18next';
import { handleRSSSubmit } from '../controllers/rssController.js';

function renderFeed(feed, container) {
  const feedElement = document.createElement('li');
  feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');
  
  feedElement.innerHTML = `
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">${feed.description}</p>
  `;
  container.appendChild(feedElement);
}

function renderPosts(posts, container) {
  posts.forEach((post) => {
    const postElement = document.createElement('li');
    postElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    
    postElement.innerHTML = `
      <a href="${post.link}" class="fw-bold" data-id="${post.feedId}" target="_blank" rel="noopener noreferrer">${post.title}</a>
      <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.feedId}" data-bs-toggle="modal" data-bs-target="#post-modal">Просмотр</button>
    `;
    container.appendChild(postElement);
  });
}

function showError(feedbackElement, inputElement, message) {
  feedbackElement.textContent = i18next.t(message);
  feedbackElement.classList.add('text-danger');
  feedbackElement.classList.remove('text-success');
  inputElement.classList.add('is-invalid');
}

function showSuccess(feedbackElement, inputElement, message) {
  feedbackElement.textContent = i18next.t(message);
  feedbackElement.classList.add('text-success');
  feedbackElement.classList.remove('text-danger');
  inputElement.classList.remove('is-invalid');
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
        const newPosts = state.posts.filter(post => post.feedId === newFeed.id);
        renderFeed(newFeed, feedsContainer);
        renderPosts(newPosts, postsContainer);
      } else {
        showError(feedbackElement, inputElement, value);
      }
    }
  });

  form.addEventListener('submit', (event) => handleRSSSubmit(event, watchedState));
  return watchedState;
}
