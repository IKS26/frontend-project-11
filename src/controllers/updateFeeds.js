import parseFeed from './parseFeed.js';
import { setState } from '../models/model.js';
import { renderPosts } from '../views/renders.js';
import { loadFeed } from './handleFormSubmit.js';

const AUTO_UPDATE_INTERVAL = 20000;

const updateFeeds = (watchedState, i18nextInstance) => {
  const { feeds, posts } = watchedState;

  if (!feeds || feeds.length === 0) {
    return;
  }

  feeds.forEach((feed) => {
    loadFeed(feed.url)
      .then(parseFeed)
      .then((parsedData) => {
        const { items } = parsedData;

        const normalizeLink = (link) => new URL(link).href;
        const existingPostLinks = new Set(
          posts.map((post) => normalizeLink(post.link)),
        );

        const newPosts = items
          .filter((item) => !existingPostLinks.has(normalizeLink(item.link)))
          .map((item) => ({
            title: item.title,
            link: item.link,
            feedId: feed.id,
            id: `${feed.id}-${item.link}`,
          }));

        if (newPosts.length > 0) {
          const updatedPosts = [...newPosts, ...posts];
          setState({ posts: updatedPosts });
          renderPosts(watchedState.posts, watchedState, i18nextInstance);
        }
      })
      .catch((error) => {
        console.error('Error updating feed:', error);
      });
  });
};

const startFeedsAutoUpdate = (watchedState, i18nextInstance) => {
  const update = () => {
    console.log('Периодическое обновление RSS...');
    updateFeeds(watchedState, i18nextInstance);
    setTimeout(update, AUTO_UPDATE_INTERVAL);
  };

  update();
};

export default startFeedsAutoUpdate;
