import axios from 'axios';
import fs from 'fs';
import { formatUrl, formatToFileName } from './utils';

const { promises: fsPromises } = fs;

const saveAsFile = (url, path = '/') => axios
  .get(url)
  .then((resp) => {
    const fileName = formatToFileName(formatUrl(url), 'html');
    fsPromises.writeFile(`${path}/${fileName}`, resp.data);
  })
  .catch(e => console.error(e));

export default saveAsFile;
