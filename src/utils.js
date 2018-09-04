import URL from 'url';

const formatUrl = (urlLink) => {
  const link = URL.parse(urlLink);
  const newName = `${link.host}${(link.path !== '/') ? link.path : ''}`;
  return newName.replace(/[^A-Za-z0-9]/g, '-');
};

const formatToFileName = (name, format) => `${name}.${format}`;

export { formatUrl, formatToFileName };
