import axios from 'axios';
import { renderPosts } from '../views/view.js';

const AUTO_UPDATE_INTERVAL = 20000;

export function loadRSS(url) {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
  return axios
    .get(proxyUrl)
    .then((response) => response.data.contents)
    .catch((err) => {
      throw new Error('network_error', err);
    });
}

export function parseRSS(data) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'application/xml');
  const parseError = xml.querySelector('parsererror');

  if (parseError) {
    throw new Error('parsing_error');
  }

  const title = xml.querySelector('channel > title').textContent;
  const description = xml.querySelector('channel > description').textContent;
  const items = Array.from(xml.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }));

  return { title, description, items };
}

export const updateRSSFeed = (watchedState, setState, i18nextInstance) => {
  const { feeds, posts } = watchedState;

  if (!feeds || feeds.length === 0) {
    return;
  }

  feeds.forEach((feed) => {
    loadRSS(feed.url)
      .then(parseRSS)
      .then((parsedData) => {
        const { items } = parsedData;

        const existingPostLinks = new Set(posts.map((post) => post.link));
        const newPosts = items
          .filter((item) => !existingPostLinks.has(item.link))
          .map((item) => ({
            title: item.title,
            link: item.link,
            feedId: feed.id,
            id: `${feed.id}-${item.link}`,
          }));

        if (newPosts.length > 0) {
          watchedState.posts.unshift(...newPosts);
          renderPosts(watchedState.posts, watchedState, i18nextInstance);
        }
      })
      .catch(() => {
        setState({
          feedback: i18nextInstance.t('network_error'),
          feedbackType: 'error',
        });
      });
  });
};

export const startAutoUpdate = (watchedState, setState, i18nextInstance) => {
  const update = () => {
    console.log('Периодическое обновление RSS...');
    updateRSSFeed(watchedState, setState, i18nextInstance);
    setTimeout(update, AUTO_UPDATE_INTERVAL);
  };

  update();
};
