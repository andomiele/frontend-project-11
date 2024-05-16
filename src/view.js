import onChange from 'on-change';

const watch = (initialState, elements) => {
  const state = onChange(initialState, (path, newValue) => {
    if (path === 'fields.textError') {
      const message = elements.feedback;
      message.textContent = newValue;
    }
    if (path === 'fields.isValid') {
      if (!initialState.fields.isValid) {
        elements.feedback.classList.add('text-danger');
        elements.input.classList.add('is-invalid');
      }
      if (initialState.fields.isValid) {
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
