import axios from 'axios';
import i18next from 'i18next';

const POLL_INTERVAL = 5000;

export function loadRSS(url) {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
  console.log('Fetching from:', proxyUrl);

  return axios
    .get(proxyUrl)
    .then((response) => response.data.contents)
    .catch((error) => {
      console.error(i18next.t('network_error'), error);
      throw new Error('network_error');
    });
}

export function parseRSS(data) {
  return new Promise((resolve, reject) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
    const parseError = xml.querySelector('parsererror');

    if (parseError) {
      console.error(i18next.t('invalid_rss'), parseError.textContent);
      reject(new Error('parsing_error'));
    } else {
      try {
        const title = xml.querySelector('channel > title').textContent;
        const description = xml.querySelector(
          'channel > description'
        ).textContent;
        const items = Array.from(xml.querySelectorAll('item')).map((item) => ({
          title: item.querySelector('title').textContent,
          link: item.querySelector('link').textContent,
          description: item.querySelector('description').textContent,
        }));
        resolve({ title, description, items });
      } catch (error) {
        console.error(i18next.t('invalid_rss'), error);
        reject(new Error('parsing_error'));
      }
    }
  });
}

export function updateRSSFeeds(state, onNewPosts) {
  const updatePromises = state.feeds.map((feed) =>
    loadRSS(feed.url)
      .then(parseRSS)
      .then((parsedData) => {
        const existingPostsLinks = new Set(
          state.posts.map((post) => post.link)
        );
        const newPosts = parsedData.items.filter(
          (item) => !existingPostsLinks.has(item.link)
        );

        if (newPosts.length > 0) {
          const posts = newPosts.map((item) => ({ ...item, feedId: feed.id }));
          onNewPosts(feed, posts);
        }
      })
      .catch((error) =>
        console.error(`Failed to update feed ${feed.url}:`, error)
      )
  );

  Promise.all(updatePromises).then(() => {
    setTimeout(() => updateRSSFeeds(state, onNewPosts), POLL_INTERVAL);
  });
}
