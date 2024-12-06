/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import initView from './view.js';
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

const handleLoadingErrors = (error) => {
  if (error.isAxiosError) {
    return 'network_error';
  }

  if (error.isParserError) {
    return 'rss_error';
  }

  return 'unknown_error';
};

const loadRss = (url, watchedState) => {
  watchedState.loadingProcess.status = 'loading';

  return axios
    .get(addProxy(url), { timeout: 10000 })
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
    })
    .catch((error) => {
      console.error('Error loading RSS:', error);
      watchedState.loadingProcess.status = 'fail';
      watchedState.loadingProcess.error = handleLoadingErrors(error);
    });
};

const handleFormSubmit = (event, watchedState, i18nextInstance) => {
  event.preventDefault();

  const urlInput = event.target.elements.url;
  const url = urlInput.value.trim();

  const { feeds } = watchedState;
  const existingUrls = feeds.map((feed) => feed.url);

  validate(url, existingUrls).then((validationError) => {
    if (validationError) {
      watchedState.form = {
        error: i18nextInstance.t(validationError),
        isValid: false,
      };
      return;
    }

    watchedState.form = { error: '', isValid: true };
    loadRss(url, watchedState, i18nextInstance);
  });
};

const handlePostClick = (event, watchedState) => {
  const { postId } = event.target.dataset;
  if (!postId) return;

  if (!watchedState.ui.readPosts.includes(postId)) {
    watchedState.ui.readPosts.push(postId);
  }
  watchedState.ui.modal.postId = postId;
};

const updateRss = (watchedState) => {
  const { feeds, posts } = watchedState;

  const promises = feeds.map((feed) => axios
    .get(addProxy(feed.url))
    .then((response) => {
      const parsedData = parseRss(response.data.contents);
      const { items } = parsedData;

      const newPosts = items
        .filter(
          (item) => !posts.some(
            (post) => post.link === item.link && post.feedId === feed.id,
          ),
        )
        .map((item) => ({
          title: item.title,
          description: item.description,
          link: item.link,
          feedId: feed.id,
          id: _.uniqueId(),
        }));

      watchedState.posts = [...newPosts, ...posts];
    })
    .catch((error) => {
      console.error(`Error updating feed "${feed.url}":`, error);
    }));

  Promise.all(promises).then(() => {
    setTimeout(() => updateRss(watchedState), AUTO_UPDATE_INTERVAL);
  });
};

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
          readPosts: [],
          modal: {
            postId: null,
          },
        },
      };

      const domElements = {
        form: document.querySelector('.rss-form'),
        inputField: document.querySelector('#url-input'),
        addButton: document.querySelector('.rss-form button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds .card'),
        posts: document.querySelector('.posts .card'),
        modal: document.querySelector('.modal'),
      };

      const watchedState = initView(initialState, domElements, i18nextInstance);

      const { form, posts } = domElements;
      form.addEventListener('submit', (event) => handleFormSubmit(event, watchedState, i18nextInstance));
      posts.addEventListener('click', (event) => handlePostClick(event, watchedState));

      updateRss(watchedState);
    })
    .catch((error) => {
      console.error('Error initializing app:', error);
    });
};

export default runApp;
