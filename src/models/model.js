const state = {
  feeds: [],
  posts: [],
  readPosts: new Set(),
  feedback: '',
  feedbackType: null,
};

export const getState = () => state;

export const setState = (newState) => {
  Object.assign(state, newState);
};

export const addFeed = (feed, posts, watchState) => {
  watchState.feeds.push(feed);
  watchState.posts.unshift(...posts);
};

export const getPostById = (postId) => state.posts.find((post) => post.id === postId);

export const markPostAsRead = (postId) => {
  state.readPosts.add(postId);
};

export default state;
