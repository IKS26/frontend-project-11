/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import initView, { renderPosts, renderModal } from './view.js';
import parseRss from './parser.js';
import resources from './locales/index.js';
import customLocale from './locales/customLocale.js';

const AUTO_UPDATE_INTERVAL = 2000;

const validate = (url, existingUrls) => {
  const schema = yup.string().required().url().notOneOf(existingUrls);

  return schema
    .validate(url)
    .then(() => null)
    .catch((error) => error.message);
};

const addProxy = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.append('url', url);
  proxyUrl.searchParams.append('disableCache', 'true');
  return proxyUrl.toString();
};

const handleLoadingProcessError = (error, i18nextInstance) => {
  if (!error) {
    return i18nextInstance.t('rss_added');
  }
  return error.message === 'network_error'
    ? i18nextInstance.t('network_error')
    : i18nextInstance.t('invalid_rss');
};

const loadRss = (url, watchedState, i18nextInstance) => {
  watchedState.loadingProcess.status = 'loading';

  return axios
    .get(addProxy(url))
    .then((response) => {
      const { title, description, items } = parseRss(response.data.contents);

      const feed = {
        id: _.uniqueId(),
        url,
        title,
        description,
      };

      const posts = items.map((item) => ({
        title: item.title,
        description: item.description,
        link: item.link,
        feedId: feed.id,
        id: _.uniqueId(),
      }));

      watchedState.feeds.push(feed);
      watchedState.posts = [...posts, ...watchedState.posts];
      watchedState.loadingProcess.status = 'success';
      watchedState.loadingProcess.error = handleLoadingProcessError(
        null,
        i18nextInstance,
      );
    })
    .catch((error) => {
      watchedState.loadingProcess.status = 'fail';
      watchedState.loadingProcess.error = handleLoadingProcessError(
        error,
        i18nextInstance,
      );
    });
};

const handleFormSubmit = (event, watchedState, i18nextInstance) => {
  event.preventDefault();
  const urlInput = event.target.elements.url;
  const url = urlInput.value.trim();

  const { feeds } = watchedState;
  const existingUrls = feeds.map((feed) => feed.url);

  validate(url, existingUrls)
    .then((validationError) => {
      if (validationError) {
        watchedState.form = {
          error: i18nextInstance.t(validationError),
          isValid: false,
        };
        return Promise.reject(new Error(validationError));
      }

      watchedState.form = { error: '', isValid: true };
      watchedState.loadingProcess.status = 'loading';

      return loadRss(url, watchedState, i18nextInstance);
    })
    .catch((error) => {
      watchedState.form = { error: error.message, isValid: false };
    });
};

const handlePostPreview = (postId, watchedState) => {
  const post = watchedState.posts.find((p) => p.id === postId);
  if (post) {
    if (!(watchedState.ui.readPosts instanceof Set)) {
      watchedState.ui.readPosts = new Set();
    }
    watchedState.ui.readPosts.add(postId);
    watchedState.ui.modal = { postId };
    renderModal(post.title, post.description, post.link, postId);
  }
};

const initHandlers = (watchedState, domElements, i18nextInstance) => {
  domElements.form.addEventListener('submit', (event) => handleFormSubmit(event, watchedState, i18nextInstance));

  document.addEventListener('click', (event) => {
    const { target } = event;
    if (target.classList.contains('post-preview')) {
      const { postId } = target.dataset;
      handlePostPreview(postId, watchedState);
    }
  });

  document.addEventListener('mousedown', (event) => {
    const { target } = event;
    if (target.tagName === 'A' && target.closest('.posts')) {
      const postElement = target.closest('li');
      if (postElement) {
        const button = postElement.querySelector('button[data-post-id]');
        if (button) {
          const { postId } = button.dataset;
          if (!(watchedState.ui.readPosts instanceof Set)) {
            watchedState.ui.readPosts = new Set();
          }
          watchedState.ui.readPosts.add(postId);
          target.classList.replace('fw-bold', 'fw-normal');
        }
      }
    }
  });
};

const init = () => {
  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      lng: 'ru',
      fallbackLng: 'en',
      resources,
      debug: false,
    })
    .then(() => {
      yup.setLocale(customLocale);

      const initialState = {
        feeds: [],
        posts: [],
        form: {
          error: '',
          isValid: true,
        },
        loadingProcess: {
          status: 'idle',
          error: '',
        },
        ui: {
          readPosts: new Set(),
          modal: {
            postId: null,
          },
        },
      };

      const state = _.cloneDeep(initialState);
      const domElements = {
        form: document.querySelector('.rss-form'),
        inputField: document.querySelector('#url-input'),
        addButton: document.querySelector('.rss-form button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        feedsContainer: document.querySelector('.feeds .list-group'),
      };
      const watchedState = initView(state, domElements, i18nextInstance);

      initHandlers(watchedState, domElements, i18nextInstance);

      const updateRss = () => {
        const { feeds, posts } = watchedState;

        const promises = feeds.map((feed) => axios
          .get(addProxy(feed.url))
          .then((response) => {
            const parsedData = parseRss(response.data.contents);
            const { items } = parsedData;

            const newPosts = items
              .filter(
                (item) => !watchedState.posts.some((post) => post.link === item.link),
              )
              .map((item) => ({
                title: item.title,
                description: item.description,
                link: item.link,
                feedId: feed.id,
                id: _.uniqueId(),
              }));

            watchedState.posts = [...newPosts, ...posts];
            renderPosts(watchedState.posts, watchedState, i18nextInstance);
          })
          .catch((error) => {
            console.error('Error updating feed:', error);
          }));

        Promise.all(promises).then(() => {
          setTimeout(updateRss, AUTO_UPDATE_INTERVAL);
        });
      };

      updateRss();
    })
    .catch((error) => {
      console.error('Error initializing app:', error);
    });
};

const runApp = () => {
  init();
};

export default runApp;
