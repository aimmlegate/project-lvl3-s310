import axios from 'axios';
import fs from 'fs';
import URL from 'url';

const fsPromises = fs.promises;

const formatUrl = (urlLink) => {
  const link = URL.parse(urlLink);
  const newName = `${link.host}${(link.path !== '/') ? link.path : ''}`;
  return newName.replace(/[^A-Za-z0-9]/g, '-');
};

const fileCreate = (url, path = '/') => axios
  .get(url)
  .then(resp => fsPromises.writeFile(`${path}/${formatUrl(url)}.html`, resp.data))
  .catch(e => console.error(e));


export { formatUrl, fileCreate };
