import './assets/style.css';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { startRSSUpdates } from './controllers/rssController.js';
import initView from './views/view.js';
import './views/modal.js';
import state from './models/model.js';
import en from './locales/en.json';
import ru from './locales/ru.json';

// Проверка на инициализацию
if (!window.appInitialized) {
  console.log('Initializing app...');
  window.appInitialized = true;

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
