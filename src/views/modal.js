import { closeModal } from '../controllers/rssController';

document.addEventListener('DOMContentLoaded', () => {
  // Обработчики для кнопок закрытия модального окна
  document.querySelector('.btn-close').addEventListener('click', closeModal);
  document
    .querySelector('.btn-secondary')
    .addEventListener('click', closeModal);
});
