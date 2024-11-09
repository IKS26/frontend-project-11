import './assets/style.css';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { startRSSUpdates } from './controllers/rssController.js';
import initView from './views/view.js';
import './views/modalWindow.js';
import state from './models/model.js';
import en from './locales/en';
import ru from './locales/ru';

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
  startRSSUpdates(state);
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
