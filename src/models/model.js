/* eslint-disable no-param-reassign */
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

const state = JSON.parse(JSON.stringify(initialState));
state.ui.readPosts = new Set(initialState.ui.readPosts);

const getState = () => state;

export const setState = (newState) => {
  Object.assign(state, newState);
};

export const addFeed = (feed, posts, watchState) => {
  watchState.feeds = [...watchState.feeds, feed];
  watchState.posts = [...posts, ...watchState.posts];
};

export const getPostById = (postId) => state.posts.find((post) => post.id === postId);

export const markPostAsRead = (postId) => {
  if (!(state.ui.readPosts instanceof Set)) {
    state.ui.readPosts = new Set();
  }
  state.ui.readPosts.add(postId);
};

export default getState;
