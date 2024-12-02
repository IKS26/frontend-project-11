const parseRss = (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'application/xml');
  const parseError = xml.querySelector('parsererror');

  if (parseError) {
    const error = new Error('rss_error');
    error.isParserError = true;
    throw error;
  }

  const title = xml.querySelector('channel > title').textContent;
  const description = xml.querySelector('channel > description').textContent;
  const items = Array.from(xml.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }));

  return { title, description, items };
};

export default parseRss;
