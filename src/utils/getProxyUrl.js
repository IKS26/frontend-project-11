const getProxyUrl = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.append('url', url);
  proxyUrl.searchParams.append('disableCache', true);
  return proxyUrl.toString();
};

export default getProxyUrl;
