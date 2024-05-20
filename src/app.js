import { string, setLocale } from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import watch from './view.js';
import resources from './ru.js';
import parse from './parser.js';

// setLocale({
//   string: {
//     url: resources.translation.invalidURL,
//     required: resources.translation.emptyString,
//   },
//   mixed: {
//     notOneOf: resources.translation.existRSS,
//   },
// });

// const validate = (form, urlList, i18next) => {
//   const schema = string().url().required();

//   return schema
//     .notOneOf(urlList)
//     .validate(form)
//     .then(() => null)
//     .catch((error) => i18next.t(error.message));
// };

setLocale({
  string: {
    url: 'invalidURL',
    required: 'emptyString',
  },
  mixed: {
    notOneOf: 'existRSS',
  },
});

const validate = (form, urlList) => {
  const schema = string().url().required();

  return schema
    .notOneOf(urlList)
    .validate(form)
    .then(() => null)
    .catch((error) => (error.message));
};

const addProxy = (url) => {
  const newUrl = new URL('https://allorigins.hexlet.app/get');
  newUrl.searchParams.set('disableCache', 'true');
  newUrl.searchParams.set('url', url);
  return newUrl;
};

const load = async (inputUrl, initialState) => {
  axios.get(addProxy(inputUrl))
    .then((response) => parse(response.data, initialState))
    .catch((error) => {
      console.log('loadError', error);
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
    feeds: [],
    urlList: [],
    postList: [],
  };

  const elements = {
    form: document.querySelector('form'),
    button: document.querySelector('[type="submit"]'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
  };

  const i18next = i18n.createInstance();
  const watchedState = watch(initialState, elements, i18next);

  i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  })
    .then(() => elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const url = formData.get('url');
      validate(url, initialState.urlList)
        .then((error) => {
          if (error) {
            watchedState.form.textError = error;
            watchedState.form.isValid = false;
            // eslint-disable-next-line no-useless-return
            return;
          }
        });
      watchedState.form.isValid = true;
      watchedState.form.textError = 'validRSS';
      load(url, initialState)
        .then((error) => {
          if (error) {
            watchedState.load.textError = error;
            watchedState.form.isValid = false;
            // eslint-disable-next-line no-useless-return
            return;
          }
        });
      watchedState.urlList.push(url);
    }));
  console.log(initialState);
};
export default app;
