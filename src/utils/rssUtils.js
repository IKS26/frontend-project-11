import axios from 'axios';

const POLL_INTERVAL = 5000;

export function loadRSS(url) {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
  return axios
    .get(proxyUrl)
    .then((response) => response.data.contents)
    .catch(() => {
      throw new Error('network_error');
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

export function updateRSSFeeds(state, onNewPosts) {
  console.log('Updating RSS Feeds...'); // Отладочное сообщение
  const updatePromises = state.feeds.map((feed) => loadRSS(feed.url)
    .then(parseRSS)
    .then((parsedData) => {
      const existingPostsLinks = new Set(
        state.posts.map((post) => post.link),
      );
      const newPosts = parsedData.items.filter(
        (item) => !existingPostsLinks.has(item.link),
      );

      if (newPosts.length > 0) {
        const posts = newPosts.map((item) => ({ ...item, feedId: feed.id }));
        onNewPosts(feed, posts);
      }
    })
    .catch((error) => console.error(`Failed to update feed ${feed.url}:`, error)));

  Promise.all(updatePromises).then(() => {
    setTimeout(() => updateRSSFeeds(state, onNewPosts), POLL_INTERVAL);
  });
}

export const startRSSUpdates = (state, addFeed) => {
  const onNewPosts = (feed, newPosts) => {
    addFeed(feed, newPosts, state);
  };
  updateRSSFeeds(state, onNewPosts);
};
