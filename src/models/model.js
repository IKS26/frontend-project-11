const state = {
  feeds: [], // Список RSS-лент
  posts: [], // Список постов
  readPosts: new Set(), // ID прочитанных постов
  feedback: '', // Сообщения об ошибках или успехе
};

export function addFeed(feed, posts) {
  state.feeds.push(feed);
  state.posts.push(...posts);
}

export function getPostById(postId) {
  return state.posts.find((post) => post.id === postId);
}

export function markPostAsRead(postId) {
  state.readPosts.add(postId);
}

export default state;
