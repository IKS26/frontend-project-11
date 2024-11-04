import onChange from 'on-change';

// Функция для отображения ошибки
export function showError(message) {
  const feedbackElement = document.querySelector('.feedback');
  feedbackElement.textContent = message;
  feedbackElement.classList.add('text-danger');
}

// Функция для очистки поля ввода и возврата фокуса
export function clearInputField(inputElement) {
  inputElement.value = '';
  inputElement.focus();
}

// Функция для инициализации отображения
export default function initView(state) {
  const feedbackElement = document.querySelector('.feedback');

  // Подписка на изменения состояния с помощью onChange
  const watchedState = onChange(state, (path, value) => {
    if (path === 'feedback') {
      feedbackElement.textContent = value;
      feedbackElement.classList.toggle('text-danger', value.includes('ошибка'));
    }
  });

  return watchedState;
}
