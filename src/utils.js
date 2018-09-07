import url, { URL } from 'url';
import path from 'path';
import cheerio from 'cheerio';
import _ from 'lodash';

export const formatUrl = (urlLink) => {
  const link = url.parse(urlLink);
  const newName = `${link.host}${(link.path !== '/') ? link.path : ''}`;
  return newName.replace(/[^A-Za-z0-9]/g, '-');
};

export const getDirname = urlLink => `${formatUrl(urlLink)}__files`;

export const formatToFileName = (name, format) => `${name}.${format}`;

export const getFilename = (filepath) => {
  const filepathUrl = new URL(filepath, 'http://dumb.ass');
  return filepathUrl.pathname.split('/').filter(v => v !== '').join('-');
};

export const getAllSrcFromHtml = (html) => {
  const $ = cheerio.load(html);
  const tags = $('link, script, img');
  return Object.keys(tags).map((tagKey) => {
    const attrib = Object.keys(tags[tagKey].attribs || {})
      .filter(el => (el === 'src' || el === 'href'))[0];
    if (attrib) {
      return tags[tagKey].attribs[attrib];
    }
    return null;
  }).filter(el => el !== null);
};

export const isLocalLink = (link) => {
  const checkUrl = new URL(link, 'http://dumb.ass');
  return (checkUrl.origin === 'http://dumb.ass');
};

export const filterLocalLinks = linksArray => linksArray.filter(urlElem => isLocalLink(urlElem));

export const transformLocalToAbsLinks = (baseurl, linksArray) =>
  linksArray.map(src => new URL(src, baseurl).href);

/* eslint func-names: ["error", "never"] */

export const transformAllSrcInHtml = (html, local, dir, erase = false) => {
  const $ = cheerio.load(html);
  $('script, img, link').each(function () {
    const key = $(this).attr().src ? 'src' : 'href';
    const oldSrc = $(this).attr(key);
    if (oldSrc !== undefined && isLocalLink(oldSrc)) {
      const newSrc = path.resolve(local, dir, getFilename(oldSrc));
      $(this).attr(key, erase ? '#' : newSrc);
    }
  });
  return $.html();
};

export const testpromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 3000);
});
