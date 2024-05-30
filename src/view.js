import onChange from 'on-change';

const formRendering = (state, path, elements, i18next, value) => {
  const message = elements.feedback;
  message.innerHTML = '';
  if (path === 'form') {
    if (state.form.error !== '') {
      message.textContent = i18next.t(value.error);
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
    }
  }
  if (path === 'load') {
    if (state.load.status === 'loading') {
      // eslint-disable-next-line no-param-reassign
      elements.button.disabled = true;
    }
    if (state.load.error !== '') {
      message.textContent = i18next.t(value.error);
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      // eslint-disable-next-line no-param-reassign
      elements.button.disabled = false;
    }
    if (state.load.status === 'success') {
      elements.feedback.classList.add('text-success');
      elements.feedback.classList.remove('text-danger');
      elements.input.classList.remove('is-invalid');
      message.textContent = i18next.t('validRSS');
      // eslint-disable-next-line no-param-reassign
      elements.button.disabled = false;
      elements.form.reset();
      elements.input.focus();
    }
  }
};

const postsRendering = (state, elements) => {
  // eslint-disable-next-line no-param-reassign
  elements.posts.innerHTML = '';
  const postsBlock = document.createElement('div');
  postsBlock.classList.add('card', 'border-0');
  const postsBody = document.createElement('div');
  postsBody.classList.add('card-body');
  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = 'Посты';
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
    postButton.textContent = 'Просмотр';
    postItem.prepend(postHref, postButton);
    return postItem;
  });
  postsList.replaceChildren(...posts);
  postsBody.prepend(postsTitle);
  postsBlock.prepend(postsBody, postsList);
  elements.posts.prepend(postsBlock);
};

const feedsRendering = (state, elements) => {
  // eslint-disable-next-line no-param-reassign
  elements.feeds.innerHTML = '';
  const feedsBlock = document.createElement('div');
  feedsBlock.classList.add('card', 'border-0');
  const feedsBody = document.createElement('div');
  feedsBody.classList.add('card-body');
  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = 'Фиды';
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

const modalRendering = (state, elements) => {
  const post = state.posts.find((openPost) => openPost.id === state.ui.modalId);
  const modalBody = elements.modal.querySelector('.modal-body');
  const modalTitle = elements.modal.querySelector('.modal-header > h5');
  const modalButton = elements.modal.querySelector('.modal-footer > a');
  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  modalButton.setAttribute('href', post.link);
};

const watch = (state, elements, i18next) => onChange(state, (path, newValue) => {
  switch (path) {
    case 'form':
      formRendering(state, path, elements, i18next, newValue);
      break;
    case 'load':
      formRendering(state, path, elements, i18next, newValue);
      break;
    case 'posts':
      postsRendering(state, elements);
      break;
    case 'feeds':
      feedsRendering(state, elements);
      break;
    case 'ui.viewPosts':
      postsRendering(state, elements);
      break;
    case 'ui.modalId':
      modalRendering(state, elements);
      break;
    default:
      break;
  }
});
export default watch;
