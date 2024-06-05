const parse = (response) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.contents, 'text/xml');
  if (doc.querySelector('parsererror')) {
    const error = new Error('parseError');
    error.isParserError = true;
    throw error;
    // throw new Error('parseError');
  }
  const feedTitle = doc.querySelector('channel > title').textContent;
  const feedDescription = doc.querySelector('channel > description').textContent;
  const postsCollection = doc.querySelectorAll('channel > item');
  const postsList = Array.from(postsCollection);
  const posts = postsList.map((element) => {
    const title = element.querySelector('item > title').textContent;
    const description = element.querySelector('item > description').textContent;
    const link = element.querySelector('item > link').textContent;
    return { title, description, link };
  });
  return ({
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    postsList: posts,
  });
};
export default parse;
