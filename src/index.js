import axios from 'axios';
import { promises as fsPromises } from 'fs';
import path from 'path';
import mime from 'mime';
import debug from 'debug';
import {
  formatUrl,
  formatToFileName,
  getAllSrcFromHtml,
  filterLocalLinks,
  getFilename,
  transformAllSrcInHtml,
  transformLocalToAbsLinks,
  getDirname,
} from './utils';

const logGen = debug('page-loader:gen');
const logNet = debug('page-loader:net');
const logFs = debug('page-loader:fs');
const logErr = debug('page-loader:Error');
debug.log = console.info.bind(console);

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
    .then((response) => {
      logNet('receive asset request', url);
      return response;
    })
    .then((response) => {
      logFs('start writeFile asset', fileName);
      const pathFs = path.join(pathto, fileName);
      return fsPromises.writeFile(pathFs, response.data);
    })
    .catch(e => logErr(e));
};

const saveAsFile = (url, pathto = '/') => {
  let dirname;
  let srcs;
  logNet('send HTML request', url);
  return axios
    .get(url)
    .then((response) => {
      logNet('receive HTML request', url);
      return response.data;
    })
    .then((html) => {
      dirname = getDirname(url);
      srcs = getAllSrcFromHtml(html)
        |> filterLocalLinks
        |> (_ => transformLocalToAbsLinks(url, _));
      logGen('assets dirname - ', dirname);
      logGen('assets srcs array - ', srcs);
      const transformedHtml = transformAllSrcInHtml(html, pathto, dirname);
      const fileName = formatUrl(url)
        |> (_ => formatToFileName(_, 'html'));
      return [transformedHtml, fileName];
    })
    .then(([transformedHtml, fileName]) => {
      logFs('writeFile HTML', fileName);
      return fsPromises.writeFile(path.join(pathto, fileName), transformedHtml);
    })
    .then(() => {
      logFs('create assets dir', dirname);
      return fsPromises.mkdir(path.resolve(pathto, dirname));
    })
    .then(() => Promise.all(srcs.map((src) => {
      const pathFs = path.resolve(pathto, dirname);
      logNet('send asset file request', src);
      return saveFile(src, pathFs);
    })))
    .then(() => logGen('FINISH'))
    .catch(e => logErr(e));
};

export default saveAsFile;

