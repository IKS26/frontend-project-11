import bootstrap from '../assets/bootstrap.js';

document.addEventListener('DOMContentLoaded', () => {
  // Обработчики для кнопок закрытия модального окна
  document.querySelector('.btn-close').addEventListener('click', hideModal);
  document.querySelector('.btn-secondary').addEventListener('click', hideModal);
});

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
