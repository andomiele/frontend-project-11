import { string, setLocale } from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import watch from './view.js';
import resources from './resources.js';
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
  return newUrl;
};

const load = async (inputUrl, initialState, watchedState) => {
  axios.get(addProxy(inputUrl))
    .then((result) => {
      const response = parse(result.data);
      const feedId = uniqueId();
      watchedState.feeds.push({
        url: inputUrl,
        title: response.feed.title,
        description: response.feed.description,
        id: feedId,
      });
      const posts = response.postsList;
      posts.map((post) => {
        watchedState.posts.push({
          title: post.title,
          description: post.description,
          link: post.link,
          id: uniqueId(),
          feedID: feedId,
        });
        return post;
      });
      // eslint-disable-next-line no-param-reassign
      initialState.load.textError = '';
      // eslint-disable-next-line no-param-reassign
      watchedState.parse.textError = 'validRSS';
      console.log(initialState);
    })
    .catch((error) => {
      // eslint-disable-next-line no-param-reassign
      watchedState.parse.textError = error.message === 'Network Error' ? 'loadError' : error.message;
      // eslint-disable-next-line no-param-reassign
      initialState.parse.textError = '';
    });
};

const app = () => {
  const initialState = {
    form: {
      isValid: '',
      textError: '',
    },
    load: {
      textError: '',
    },
    parse: {
      textError: '',
    },
    feeds: [{
      url: '',
      title: '',
      description: '',
      id: 0,
    }],
    posts: [{}],
    // posts: [{
    //   title: null,
    //   description: '',
    //   id: 0,
    //   feedID: 0,
    // }],
  };

  const elements = {
    form: document.querySelector('form'),
    button: document.querySelector('[type="submit"]'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
    cardBlock: document.querySelector('.posts'),
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
          .then((error) => {
            if (error) {
              watchedState.parse.textError = '';
              watchedState.form.textError = error;
              watchedState.form.isValid = false;
              return;
            }
            initialState.form.textError = '';
            watchedState.form.isValid = '';
            load(url, initialState, watchedState);
          });
      });
    });
};
export default app;
