import { string, setLocale } from 'yup';
import i18n from 'i18next';
import watch from './view.js';
import resources from './ru.js';

setLocale({
  string: {
    url: resources.translation.invalidURL,
    required: resources.translation.emptyString,
  },
  mixed: {
    notOneOf: resources.translation.existRSS,
  },
});

const validate = (fields, urlList, i18next) => {
  const schema = string().url().required();

  return schema
    .notOneOf(urlList)
    .validate(fields)
    .then(() => null)
    .catch((error) => i18next.t(error.message));
};

const app = () => {
  const initialState = {
    fields: {
      isValid: '',
      url: '',
      textError: '',
    },
    urlList: [],
    postList: [],
  };

  const elements = {
    form: document.querySelector('form'),
    button: document.querySelector('[type="submit"]'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = watch(initialState, elements);

  const i18next = i18n.createInstance();
  i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  })
    .then(() => elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      initialState.fields.url = formData.get('url');
      validate(initialState.fields.url, initialState.urlList, i18next)
        .then((error) => {
          if (error) {
            watchedState.fields.textError = error;
            watchedState.fields.isValid = false;
            return;
          }
          watchedState.fields.textError = i18next.t(resources.translation.validRSS);
          watchedState.fields.isValid = true;
          initialState.urlList.push(initialState.fields.url);
        });
    }));
  console.log(initialState);
};
export default app;
