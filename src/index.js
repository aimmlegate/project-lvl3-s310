import axios from 'axios';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { URL } from 'url';
import mime from 'mime';
import {
  formatUrl,
  formatToFileName,
  getAllSrcFromHtml,
  filterLocalLinks,
  getFilename,
  transformAllSrcInHtml,
  getDirname,
} from './utils';

const saveFile = (url, pathto) => {
  const fileName = getFilename(url);
  const extName = path.extname(fileName);
  return axios
    .request({
      responseType: 'arraybuffer',
      url,
      method: 'get',
      headers: {
        'Content-Type': mime.getType(extName),
      },
    })
    .then(response => fsPromises.writeFile(`${pathto}/${fileName}`, response.data))
    .catch(e => console.error(e));
};

const saveAsFile = (url, pathto = '/') =>
  axios
    .get(url)
    .then(response => response.data)
    .then((html) => {
      const dirname = getDirname(url);
      const srcs = getAllSrcFromHtml(html)
        |> filterLocalLinks;
      const transformedHtml = transformAllSrcInHtml(html, pathto, dirname);
      const fileName = formatUrl(url)
        |> (_ => formatToFileName(_, 'html'));
      fsPromises.writeFile(path.join(pathto, fileName), transformedHtml);
      return [dirname, srcs];
    })
    .then(([dirname, srcs]) => {
      fsPromises.mkdir(path.resolve(pathto, dirname));
      return [dirname, srcs];
    })
    .then(([dirname, srcs]) => {
      const requests = srcs.map(src =>
        saveFile(new URL(src, url).href, path.resolve(pathto, dirname)));
      return Promise.all(requests);
    })
    .catch(e => console.error(e));

export default saveAsFile;

