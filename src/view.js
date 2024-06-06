import onChange from 'on-change';

const handleFeedback = (elements, isError, message = '') => {
  // eslint-disable-next-line no-param-reassign
  elements.feedback.textContent = message;
  if (isError) {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.input.classList.add('is-invalid');
    return;
  }
  elements.feedback.classList.add('text-success');
  elements.feedback.classList.remove('text-danger');
  elements.input.classList.remove('is-invalid');
};

const handleForm = ({ form }, elements, i18next) => {
  const isError = form.isValid === false;
  const message = isError ? i18next.t(form.error) : '';
  handleFeedback(elements, isError, message);
};

const handleLoading = ({ load }, elements, i18next) => {
  const isError = load.status === 'fail';
  if (load.status === 'loading') {
    // eslint-disable-next-line no-param-reassign
    elements.form.disabled = true;
    const message = '';
    handleFeedback(elements, isError, message);
  }
  if (load.status === 'fail') {
    // eslint-disable-next-line no-param-reassign
    elements.form.disabled = false;
    const message = i18next.t(load.error);
    handleFeedback(elements, isError, message);
  }
  if (load.status === 'success') {
    // eslint-disable-next-line no-param-reassign
    elements.form.disabled = false;
    const message = i18next.t('validRSS');
    handleFeedback(elements, isError, message);
    elements.form.reset();
    elements.input.focus();
  }
};

const postsRender = (state, elements, i18next) => {
  // eslint-disable-next-line no-param-reassign
  elements.posts.innerHTML = '';
  const postsBlock = document.createElement('div');
  postsBlock.classList.add('card', 'border-0');
  const postsBody = document.createElement('div');
  postsBody.classList.add('card-body');
  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = i18next.t('posts');
  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  const posts = state.posts.map((post) => {
    const postItem = document.createElement('li');
    const postHref = document.createElement('a');
    const postButton = document.createElement('button');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    postHref.classList.add('fw-bold');
    if (state.ui.viewPosts.has(post.id)) {
      postHref.classList.remove('fw-bold');
      postHref.classList.add('fw-normal', 'link-secondary');
    }
    postHref.setAttribute('href', post.link);
    postHref.setAttribute('target', '_blank');
    postHref.setAttribute('rel', 'noopener noreferrer');
    postHref.setAttribute('data-id', post.id);
    postHref.textContent = post.title;
    postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    postButton.setAttribute('type', 'button');
    postButton.setAttribute('data-id', post.id);
    postButton.setAttribute('data-bs-toggle', 'modal');
    postButton.setAttribute('data-bs-target', '#modal');
    postButton.textContent = i18next.t('preview');
    postItem.prepend(postHref, postButton);
    return postItem;
  });
  postsList.replaceChildren(...posts);
  postsBody.prepend(postsTitle);
  postsBlock.prepend(postsBody, postsList);
  elements.posts.prepend(postsBlock);
};

const feedsRender = (state, elements, i18next) => {
  // eslint-disable-next-line no-param-reassign
  elements.feeds.innerHTML = '';
  const feedsBlock = document.createElement('div');
  feedsBlock.classList.add('card', 'border-0');
  const feedsBody = document.createElement('div');
  feedsBody.classList.add('card-body');
  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = i18next.t('feeds');
  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  const feeds = state.feeds.map((feed) => {
    const feedItem = document.createElement('li');
    feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;
    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = feed.description;
    feedItem.prepend(feedTitle, feedDescription);
    return feedItem;
  });
  feedsList.replaceChildren(...feeds);
  feedsBody.prepend(feedsTitle);
  feedsBlock.prepend(feedsBody, feedsList);
  elements.feeds.prepend(feedsBlock);
};

const modalRender = (state, elements) => {
  const post = state.posts.find((openPost) => openPost.id === state.ui.modalId);
  const modalBody = elements.modal.querySelector('.modal-body');
  const modalTitle = elements.modal.querySelector('.modal-header > h5');
  const modalButton = elements.modal.querySelector('.modal-footer > a');
  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  modalButton.setAttribute('href', post.link);
};

const watch = (state, elements, i18next) => onChange(state, (path) => {
  switch (path) {
    case 'form':
      handleForm(state, elements, i18next);
      break;
    case 'load':
      handleLoading(state, elements, i18next);
      break;
    case 'posts':
      postsRender(state, elements, i18next);
      break;
    case 'feeds':
      feedsRender(state, elements, i18next);
      break;
    case 'ui.viewPosts':
      postsRender(state, elements, i18next);
      break;
    case 'ui.modalId':
      modalRender(state, elements);
      break;
    default:
      break;
  }
});
export default watch;
