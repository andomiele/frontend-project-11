const parse = (response, initialState) => {
  const parser = new DOMParser();
  const any = parser.parseFromString(response, 'text/xml');
  console.log(any);
  if (any.querySelector('parsererror')) {
    // eslint-disable-next-line no-param-reassign
    initialState.parse.textError = 'loadError';
  }
};

export default parse;
