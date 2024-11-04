import 'bootstrap/dist/css/bootstrap.min.css';
import initView from './views/view.js';
import state from './models/state.js';
import { initFormHandler } from './controllers/rssController.js';

const watchedState = initView(state);
const formElement = document.querySelector('.rss-form');
const inputElement = document.getElementById('url-input');

// Инициализация обработчика формы
initFormHandler(formElement, inputElement, watchedState);
