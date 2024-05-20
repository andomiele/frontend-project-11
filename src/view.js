import onChange from 'on-change';

const watch = (initialState, elements, i18next) => {
  const state = onChange(initialState, (path, newValue) => {
    const message = elements.feedback;
    if (path === 'form.textError') {
      message.textContent = i18next.t(`resources.translation.${newValue}`);
    }
    if (path === 'load.textError') {
      message.textContent = i18next.t(`resources.translation.${newValue}`);
    }
    if (path === 'form.isValid') {
      if (!initialState.form.isValid) {
        elements.feedback.classList.add('text-danger');
        elements.input.classList.add('is-invalid');
      }
      if (initialState.form.isValid) {
        elements.form.reset();
        elements.input.focus();
        elements.feedback.classList.remove('text-danger');
        elements.feedback.classList.add('text-success');
        elements.input.classList.remove('is-invalid');
      }
    }
  });
  return state;
};
export default watch;
