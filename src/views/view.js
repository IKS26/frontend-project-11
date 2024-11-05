import onChange from 'on-change';
import i18next from 'i18next';
import { handleRSSSubmit } from '../controllers/rssController.js';

// Функция для отображения сообщения об ошибке
function showError(feedbackElement, inputElement, message) {
  feedbackElement.textContent = i18next.t(message);
  feedbackElement.classList.add('text-danger');
  feedbackElement.classList.remove('text-success');
  inputElement.classList.add('is-invalid');
}

// Функция для отображения успешного сообщения
function showSuccess(feedbackElement, inputElement, message) {
  feedbackElement.textContent = i18next.t(message);
  feedbackElement.classList.add('text-success');
  feedbackElement.classList.remove('text-danger');
  inputElement.classList.remove('is-invalid');
}

// Инициализация отображения
export default function initView(state) {
  const form = document.querySelector('.rss-form');
  const feedbackElement = document.querySelector('.feedback');
  const inputElement = document.getElementById('url-input');

  const watchedState = onChange(state, (path, value) => {
    if (path === 'feedback') {
      if (value === 'rss_added') {
        showSuccess(feedbackElement, inputElement, value);
      } else {
        showError(feedbackElement, inputElement, value);
      }
    }
  });

  form.addEventListener('submit', (event) => handleRSSSubmit(event, watchedState));
  return watchedState;
}
