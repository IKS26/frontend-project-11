import { renderModal } from './renders.js';
import getState, {
  setState,
  getPostById,
  markPostAsRead,
} from '../models/model.js';

const updatePostClass = (postId) => {
  const postElement = document
    .querySelector(`button[data-post-id="${postId}"]`)
    ?.closest('li');
  if (postElement) {
    const link = postElement.querySelector('a');
    if (link) {
      link.classList.replace('fw-bold', 'fw-normal');
    }
  }
};

const handlePostPreview = (postId) => {
  const post = getPostById(postId);
  if (post) {
    markPostAsRead(postId);

    const currentState = getState();
    setState({
      ui: {
        ...currentState.ui,
        modal: { postId },
      },
    });

    updatePostClass(postId);
    renderModal(post.title, post.description, post.link);
  }
};

const initPostPreviewListener = () => {
  document.addEventListener('click', (event) => {
    const { target } = event;
    if (target.classList.contains('post-preview')) {
      const { postId } = target.dataset;
      handlePostPreview(postId);
    }
  });

  document.addEventListener('mousedown', (event) => {
    const { target } = event;
    if (target.tagName === 'A' && target.closest('.posts')) {
      const postElement = target.closest('li');
      if (postElement) {
        const button = postElement.querySelector('button[data-post-id]');
        if (button) {
          const { postId } = button.dataset;
          markPostAsRead(postId);
          target.classList.replace('fw-bold', 'fw-normal');
        }
      }
    }
  });
};

export default initPostPreviewListener;
