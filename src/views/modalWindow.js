import bootstrap from '../assets/bootstrap.js';

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

// Перемещаем обработчики после объявления функции hideModal
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.btn-close').addEventListener('click', hideModal);
  document.querySelector('.btn-secondary').addEventListener('click', hideModal);
});
