import axios from 'axios';
import fs from 'fs';
import { formatUrl, formatToFileName, getAllSrcFromHtml, filterLocalLinks, getFilename, transformAllSrcInHtml } from './utils';

const { promises: fsPromises } = fs;

const saveFile = (url, path) => axios
  .get(url, { responseType: 'blob' })
  .then(response => response.data)
  .then(blob => fsPromises.writeFile(`${path}/${getFilename(url)}`, blob));


const saveAsFile = (url, path = '/') => axios
  .get(url)
  .then((resp) => {
    const fileName = formatToFileName(formatUrl(url), 'html');
    const srcs = getAllSrcFromHtml(resp.data)
      |> filterLocalLinks;
    srcs.forEach(link => saveFile(`${url}/${link}`, path));
    fsPromises.writeFile(`${path}/${fileName}`, transformAllSrcInHtml(resp.data));
  })
  .catch(e => console.error(e));


export default saveAsFile;
