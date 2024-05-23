import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty.js';

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
    const card = document.createElement('div');
    card.classList.add('card', 'border-0');
    card.innerHTML = '';
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('card-title', 'h4');
    cardTitle.textContent = 'Посты';
    const cardList = document.createElement('ul');
    cardList.classList.add('list-group', 'border-0', 'rounded-0');
    const posts = initialState.posts.map((post) => {
      const cardPost = document.createElement('li');
      const postHref = document.createElement('a');
      const postButton = document.createElement('button');
      if (post.link !== undefined) {
        cardPost.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
        postHref.classList.add('fw-bold');
        postHref.setAttribute('href', post.link);
        postHref.setAttribute('target', '_blank');
        postHref.setAttribute('rel', 'noopener noreferrer');
        postHref.setAttribute('data-id', post.feedID);
        postHref.textContent = post.title;
        postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        postButton.setAttribute('type', 'button');
        postButton.setAttribute('data-id', post.feedID);
        postButton.setAttribute('data-bs-toggle', 'modal');
        postButton.setAttribute('data-bs-target', '#modal');
        postButton.textContent = 'Просмотр';
        cardPost.prepend(postHref, postButton);
        cardList.prepend(cardPost);
      }
      return post;
    });
    card.prepend(cardList);
    cardBody.prepend(cardTitle);
    card.prepend(cardBody);
    elements.cardBlock.prepend(card);
  });
  return state;
};
export default watch;

// div class=card border-0
  // div class=card-body
    // h2 class=card-title h4 'Посты'
  // ul class=list-group border-0 rounded-0
    // li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"
      // a href="http://example.com/test/1716406800" class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer" 'Lorem ipsum 2024-05-22T19:40:00Z'
      // button type="button" class="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal" 'Просмотр'
      // ...

// div class="card border-0"
  // div class="card-body"
    // h2 class="card-title h4" 'Фиды'
  // ul class="list-group border-0 rounded-0"
    // li class="list-group-item border-0 border-end-0"
      // h3 class="h6 m-0" 'Lorem ipsum feed for an interval of 1 minutes with 10 item(s)'
      // p class="m-0 small text-black-50" 'This is a constantly updating lorem ipsum feed'