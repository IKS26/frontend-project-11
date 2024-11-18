import bootstrap from '../assets/bootstrap.js';

let modalInstance;

const showModal = (title, description, link) => {
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

export default showModal;
