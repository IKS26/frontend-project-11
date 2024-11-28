import i18next from 'i18next';
import './assets/style.css';
import getState from './models/model.js';
import initView from './views/view.js';
import resources from './locales/index.js';
import startFeedsAutoUpdate from './controllers/updateFeeds.js';
import initPostPreviewListener from './views/handlePostPreview.js';
import initFormSubmitListener from './controllers/handleFormSubmit.js';

const runApp = () => {
  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      lng: 'ru',
      fallbackLng: 'en',
      resources,
      debug: false,
    })
    .then(() => {
      const state = getState();
      const watchedState = initView(state, i18nextInstance);

      initFormSubmitListener(watchedState, i18nextInstance);
      initPostPreviewListener();

      startFeedsAutoUpdate(watchedState, i18nextInstance);
    })
    .catch((error) => {
      console.error('Error initializing app:', error);
    });
};

export default runApp;
