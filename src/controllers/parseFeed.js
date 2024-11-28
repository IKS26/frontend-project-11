const parseFeed = (data) => {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
    const parseError = xml.querySelector('parsererror');

    if (parseError) {
      throw new Error('parsing_error');
    }

    const title = xml.querySelector('channel > title').textContent;
    const description = xml.querySelector('channel > description').textContent;
    const items = Array.from(xml.querySelectorAll('item')).map((item) => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
    }));

    return { title, description, items };
  } catch (error) {
    console.error('Error parsing RSS:', error);
    throw error;
  }
};

export default parseFeed;
