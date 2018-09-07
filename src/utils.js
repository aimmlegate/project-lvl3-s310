import url, { URL } from 'url';
import path from 'path';
import cheerio from 'cheerio';

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
  const arr = [];
  const mapping = {
    img: 'src',
    script: 'src',
    link: 'href',
  };
  Object.keys(mapping)
    .forEach(tag => $(tag).each((i, el) => arr.push($(el).attr(mapping[tag]))));
  return arr.filter(v => v !== undefined);
};

export const isLocalLink = (link) => {
  const checkUrl = new URL(link, 'http://dumb.ass');
  return (checkUrl.origin === 'http://dumb.ass');
};

export const filterLocalLinks = linksArray => linksArray.filter(urlElem => isLocalLink(urlElem));

export const transformLocalToAbsLinks = (baseurl, linksArray) =>
  linksArray.map(src => new URL(src, baseurl).href);

export const transformAllSrcInHtml = (html, local, dir, erase) => {
  const $ = cheerio.load(html);
  const mapping = {
    img: 'src',
    script: 'src',
    link: 'href',
  };
  Object.keys(mapping)
    .forEach(tag => $(tag).each((i, el) => {
      const oldSrc = $(el).attr(mapping[tag]);
      if (isLocalLink(oldSrc)) {
        const newSrc = path.resolve(local, dir, getFilename(oldSrc));
        $(el).attr(mapping[tag], erase || newSrc);
      }
    }));
  return $.html();
};

export const testpromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 3000);
});
