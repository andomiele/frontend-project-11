import onChange from 'on-change';

const watch = (initialState, elements, i18next) => {
  const state = onChange(initialState, (path, newValue) => {
    // debugger
    const message = elements.feedback;
    if (path === 'form.textError') message.textContent = i18next.t(newValue);
    if (path === 'load.textError') message.textContent = i18next.t(newValue);
    if (path === 'parse.textError') message.textContent = i18next.t(newValue);

    if (!initialState.form.isValid) {
      elements.feedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
    }
    if (initialState.parse.textError === 'validRSS') {
      elements.form.reset();
      elements.input.focus();
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.input.classList.remove('is-invalid');
    }
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
    initialState.posts.map((post) => {
      const postItem = document.createElement('li');
      const postHref = document.createElement('a');
      const postButton = document.createElement('button');
      const modalHeader = elements.modal.querySelector('.modal-header');
      const modalBody = elements.modal.querySelector('.modal-body');
      const modalFooter = elements.modal.querySelector('.modal-footer');
      const modalTitle = modalHeader.querySelector('h5');
      const modalButton = modalFooter.querySelector('a');
      postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      postHref.classList.add('fw-bold');
      if (initialState.viewPosts.includes(post.id)) {
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
      postsList.prepend(postItem);
      modalTitle.textContent = post.title;
      modalBody.textContent = post.description;
      modalButton.setAttribute('href', post.link);
      return post;
    });
    postsBody.prepend(postsTitle);
    postsBlock.prepend(postsBody, postsList);
    elements.posts.prepend(postsBlock);

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
    initialState.feeds.map((feed) => {
      const feedItem = document.createElement('li');
      feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');
      const feedTitle = document.createElement('h3');
      feedTitle.classList.add('h6', 'm-0');
      feedTitle.textContent = feed.title;
      const feedDescription = document.createElement('p');
      feedDescription.classList.add('m-0', 'small', 'text-black-50');
      feedDescription.textContent = feed.description;
      feedItem.prepend(feedTitle, feedDescription);
      feedsList.prepend(feedItem);
      return feed;
    });
    feedsBody.prepend(feedsTitle);
    feedsBlock.prepend(feedsBody, feedsList);
    elements.feeds.prepend(feedsBlock);
  });
  return state;
};
export default watch;
