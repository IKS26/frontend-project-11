import './assets/style.css';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { startRSSUpdates } from './utils/rssUtils.js';
import initView from './views/view.js';
import './views/modalWindow.js';
import state, { addFeed } from './models/model.js';
// eslint-disable-next-line import/extensions
import en from './locales/en.json';
// eslint-disable-next-line import/extensions
import ru from './locales/ru.json';

// Проверка на инициализацию
if (!window.appInitialized) {
  console.log('Initializing app...');
  window.appInitialized = true;

  // Инициализация i18next
  i18next.use(LanguageDetector).init({
    lng: 'ru', // Устанавливаем русский язык по умолчанию
    fallbackLng: 'en', // Язык, на который будет происходить откат, если перевод на русском недоступен
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    debug: false,
  });

  // Инициализация приложения
  initView(state);

  // Запуск регулярного обновления RSS-лент
  startRSSUpdates(state, addFeed);
} else {
  console.log('App is already initialized');
}

// Поддержка HMR, чтобы избежать перезапуска всего приложения
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept(
    ['./views/view.js', './controllers/rssController.js'],
    () => {
      console.log('HMR updating modules...');

      // Повторно вызываем только обновленные модули
      initView(state);
      startRSSUpdates(state);
    },
  );
}
