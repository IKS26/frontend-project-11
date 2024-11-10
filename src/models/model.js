const state = {
  feeds: [], // Список RSS-лент
  posts: [], // Список постов
  readPosts: new Set(), // ID прочитанных постов
  feedback: '' // Сообщения об ошибках или успехе
};

export function addFeed(feed, posts, appState) {
  appState.feeds.push(feed);
  appState.posts.push(...posts);
}

export function getPostById(postId, appState) {
  return appState.posts.find((post) => post.id === postId);
}

export function markPostAsRead(postId, appState) {
  appState.readPosts.add(postId);
}

export default state;
