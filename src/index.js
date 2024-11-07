import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import initView from './views/view.js';
import state from './models/model.js';
import en from './locales/en.json';
import ru from './locales/ru.json';

// Инициализация i18next
i18next.use(LanguageDetector).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  fallbackLng: 'en',
  debug: false,
});

// Инициализация вида
console.log('Initializing app...');
initView(state);
