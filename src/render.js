const render = (state, value) => {
  const feedbackMessage = document.querySelector('[class="feedback"]');
  feedbackMessage.textContent = value;
  const form = document.querySelector('[class="form-control"]');
  form.classList.add('is-invalid');
  const p = document.createElement('p');
  p.textContent = state.fields.url;
  form.prepend(p);
};
export default render;
