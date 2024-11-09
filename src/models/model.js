const state = {
  feeds: [], // Список RSS-лент
  posts: [], // Список постов
  readPosts: new Set(), // ID прочитанных постов
  feedback: '', // Сообщения об ошибках или успехе
};

export function addFeed(feed, posts, appState) {
  if (Array.isArray(appState.feeds) && Array.isArray(appState.posts)) {
    const postsWithId = posts.map((post, index) => ({
      ...post,
      id: `${feed.id}-${index}`,
    }));
    appState.feeds.push(feed);
    appState.posts.push(...postsWithId);
    appState.feedback = 'rss_added'; // Обновляем сразу
  } else {
    console.error('State feeds or posts are not arrays.');
  }
}

// Функция для получения поста по его ID
export function getPostById(postId) {
  return state.posts.find((post) => post.id === postId);
}

// Функция для отметки поста как прочитанного
export function markPostAsRead(postId, appState) {
  appState.readPosts.add(postId); // Добавляем postId в Set прочитанных постов
}

export default state;
