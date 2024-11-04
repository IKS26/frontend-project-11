import { validateUrl } from '../utils/validation.js';
import { showError, clearInputField } from '../views/view.js';
import { addRss } from '../models/model.js'; // Добавление RSS в список

// Функция для инициализации обработчика событий
export function initFormHandler(formElement, inputElement, state) {
  formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = inputElement.value.trim();

    validateUrl(url, state.feeds)
      .then(() => {
        addRss(url, state); // Добавляем в состояние
        clearInputField(inputElement); // Очищаем поле и возвращаем фокус
      })
      .catch((error) => {
        showError(error.message); // Показываем сообщение об ошибке
      });
  });
}
