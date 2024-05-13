import './styles.scss';
import 'bootstrap';
import keyBy from 'lodash/keyBy.js';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import view from './view.js';

const schema = yup.object().shape({
  website: yup.string().url().nullable().required('Ссылка должна быть валидным URL'),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

const app = async () => {
  const form = document.querySelector('[class="form-control]');
  const button = document.querySelector('[type="submit"]');
  const state = {
    fields: {
      url: '',
    },
    urlList: [],
    isValid: true,
    textError: '',
    postList: [],
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.fields.url = e.target.value;
    const errors = validate(state.fields);
    state.textError = errors;
    state.isValid = isEmpty(errors);
    const urlList = state.urlList.find((element) => element.name === state.fields.url);
    if (urlList !== undefined) {
      state.isValid = false;
    }
    state.urlList.push(e.target.value);
    view(state);
  });
  button.addEventListener('click', (e) => {
    e.preventDefault();
    if (state.isValid === false) {
      view(state);
    }
  });
  view(state);
};
export default app;
