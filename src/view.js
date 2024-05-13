import onChange from 'on-change';
import render from './render.js';

const view = (state) => {
  const watchedState = onChange(state, (path, newValue) => {
    if (path === 'textError') {
      render(state, newValue);
    }
  });
  return watchedState;
};
export default view;
