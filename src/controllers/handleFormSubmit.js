import axios from 'axios';
import validateForm from './validateForm.js';
import parseFeed from './parseFeed.js';
import { setState, addFeed } from '../models/model.js';
import { domElements } from '../views/view.js';
import getProxyUrl from '../utils/getProxyUrl.js';
import {
  handleFormValidationError,
  handleLoadingProcess,
  handleLoadingProcessError,
} from '../views/handlers.js';

export const loadFeed = (url) => {
  const proxyUrl = getProxyUrl(url);
  return axios
    .get(proxyUrl)
    .then((response) => response.data.contents)
    .catch((err) => {
      throw new Error('network_error', err);
    });
};

const handleFormSubmit = (event, watchedState, i18nextInstance) => {
  event.preventDefault();
  const form = event.target;
  const urlInput = form.elements.url;
  const url = urlInput.value.trim();

  const { feeds } = watchedState;
  const existingUrls = feeds.map((feed) => feed.url);

  const validationFormError = validateForm(url, existingUrls);
  if (validationFormError) {
    setState({
      form: { error: i18nextInstance.t(validationFormError), isValid: false },
      loadingProcess: { status: 'idle', error: '' },
    });
    handleFormValidationError(watchedState.form, domElements, i18nextInstance);
    return;
  }

  setState({
    form: { error: '', isValid: true },
    loadingProcess: { status: 'loading', error: '' },
  });
  handleFormValidationError(watchedState.form, domElements, i18nextInstance);
  handleLoadingProcess(
    watchedState.loadingProcess,
    domElements,
    i18nextInstance,
  );

  loadFeed(url)
    .then(parseFeed)
    .then(({ title, description, items }) => {
      const feed = {
        id: Date.now(),
        url,
        title,
        description,
      };
      const posts = items.map((item) => ({
        ...item,
        feedId: feed.id,
        id: `${feed.id}-${item.link}`,
      }));

      addFeed(feed, posts, watchedState);
      setState({
        loadingProcess: { status: 'success', error: '' },
      });
      handleLoadingProcess(
        watchedState.loadingProcess,
        domElements,
        i18nextInstance,
      );
    })
    .catch((error) => {
      const errorMessage = handleLoadingProcessError(error, i18nextInstance);
      setState({
        loadingProcess: { status: 'fail', error: errorMessage },
      });
      handleLoadingProcess(
        watchedState.loadingProcess,
        domElements,
        i18nextInstance,
      );
    });
};

const initFormSubmitListener = (watchedState, i18nextInstance) => {
  const { form } = domElements;
  form.addEventListener('submit', (event) => handleFormSubmit(event, watchedState, i18nextInstance));
};

export default initFormSubmitListener;
