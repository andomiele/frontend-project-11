import { string, setLocale } from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import watch from './view.js';
import resources from './locales/resources.js';
import parse from './parser.js';

setLocale({
  string: {
    url: 'invalidURL',
    required: 'emptyString',
  },
  mixed: {
    notOneOf: 'existRSS',
  },
});

const validate = (url, urlList) => {
  const schema = string().url().required();

  return schema
    .notOneOf(urlList)
    .validate(url)
    .then(() => null)
    .catch((error) => (error.message));
};

const addProxy = (url) => {
  const newUrl = new URL('https://allorigins.hexlet.app/get');
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', url);
  return newUrl.href;
};

const catchError = (error) => {
  if (error.isAxiosError) return ({ message: 'loadError' });
  if (error.isParserError) return ('parseError');
  return error;
};

const load = async (inputUrl, watchedState) => {
  // eslint-disable-next-line no-param-reassign
  watchedState.load = {
    error: '',
    status: 'loading',
  };
  axios.get(addProxy(inputUrl))
    .then((result) => {
      const response = parse(result.data);
      const feedId = uniqueId();
      const feed = {
        url: inputUrl,
        title: response.feed.title,
        description: response.feed.description,
        id: feedId,
      };
      // eslint-disable-next-line no-param-reassign
      watchedState.feeds = [...watchedState.feeds, feed];
      const posts = response.postsList.map((post) => ({
        title: post.title,
        description: post.description,
        link: post.link,
        id: uniqueId(),
        feedID: feedId,
      }));

      // eslint-disable-next-line no-param-reassign
      watchedState.posts = [...posts, ...watchedState.posts];
      // eslint-disable-next-line no-param-reassign
      watchedState.load = {
        error: '',
        status: 'success',
      };
    })
    .catch((error) => {
      // eslint-disable-next-line no-param-reassign
      watchedState.load = {
        error: catchError(error).message,
        status: 'fail',
      };
    });
};

const reload = async (watchedState) => {
  const promises = watchedState.feeds.map((feed) => {
    const promise = axios.get(addProxy(feed.url))
      .then((result) => {
        const response = parse(result.data);
        const oldPosts = watchedState.posts.map((oldPost) => oldPost.link);
        if (watchedState.load.status === 'success') {
          const newPosts = response.postsList
            .filter((post) => !oldPosts.includes(post.link))
            .map((post) => {
              const newPost = {
                title: post.title,
                description: post.description,
                link: post.link,
                id: uniqueId(),
                feedID: feed.id,
              };
              return newPost;
            });
          // eslint-disable-next-line no-param-reassign
          watchedState.posts = [...newPosts, ...watchedState.posts];
        }
      })
      .catch((error) => console.log('Ошибка: ', error));
    return promise;
  });
  Promise.all(promises).then(() => setTimeout(() => reload(watchedState), 5000));
};

const app = () => {
  const initialState = {
    form: {
      error: '',
      isValid: false,
    },
    load: {
      error: '',
      status: 'idle',
    },
    feeds: [],
    posts: [],
    ui: {
      viewPosts: new Set(),
      modalId: null,
    },
  };

  const elements = {
    form: document.querySelector('form'),
    button: document.querySelector('[type="submit"]'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modal: document.querySelector('[class="modal-content"]'),
  };

  const i18next = i18n.createInstance();
  i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  })
    .then(() => {
      const watchedState = watch(initialState, elements, i18next);
      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url');
        const urlList = initialState.feeds.map((element) => element.url);
        validate(url, urlList)
          .then((formError) => {
            if (formError) {
              watchedState.form = {
                error: formError,
                isValid: false,
              };
              return;
            }
            watchedState.form = {
              error: '',
              isValid: true,
            };
            load(url, watchedState);
          });
      });

      elements.posts.addEventListener('click', (event) => {
        const postId = event.target.dataset.id;
        if (postId !== undefined) {
          watchedState.ui.viewPosts.add(postId);
          watchedState.ui.modalId = postId;
        }
      });

      reload(watchedState);
    });
};
export default app;
