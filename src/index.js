import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import initView from './views/view.js';
import state from './models/state.js';

import en from './locales/en.json';
import ru from './locales/ru.json';

// Инициализируем i18next для переключения языков
i18next
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    fallbackLng: 'en',
    debug: false,
  });

// Инициализация состояния и обработчика формы
const watchedState = initView(state);
