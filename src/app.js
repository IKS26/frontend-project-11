import i18next from 'i18next';
import './assets/style.css';
import state from './models/model.js';
import initView from './views/view.js';
import resources from './locales/index.js';
import { startAutoUpdate } from './utils/rssUtils.js';
import { configureValidation } from './utils/validation.js';
import {
  initFormListener,
  attachPostPreviewListener,
} from './controllers/rssController.js';

const initApp = () => {
  const i18nextInstance = i18next.createInstance();

  return i18nextInstance
    .init({
      lng: 'ru',
      fallbackLng: 'en',
      resources,
      debug: false,
    })
    .then(() => {
      configureValidation(i18nextInstance);

      const form = document.querySelector('.rss-form');

      const { watchedState, setState } = initView(state, i18nextInstance);

      initFormListener(form, watchedState, setState, i18nextInstance);
      attachPostPreviewListener();

      startAutoUpdate(watchedState, setState, i18nextInstance);
    })
    .catch((err) => {
      console.error('Error initializing app:', err);
    });
};

export default initApp;
