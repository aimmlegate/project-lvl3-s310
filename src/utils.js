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
    if (_.has(tags[tagKey].attribs, 'src')) {
      return tags[tagKey].attribs.src;
    }
    if (_.has(tags[tagKey].attribs, 'href')) {
      return tags[tagKey].attribs.href;
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

export const transformAllSrcInHtml = (html, local, dir) => {
  const $ = cheerio.load(html);
  $('script, img').each(function () {
    const oldSrc = $(this).attr('src');
    if (oldSrc !== undefined && isLocalLink(oldSrc)) {
      const newSrc = path.resolve(local, dir, getFilename(oldSrc));
      $(this).attr('src', newSrc);
    }
  });
  $('link').each(function () {
    const oldHref = $(this).attr('href');
    if (oldHref !== undefined && isLocalLink(oldHref)) {
      const newHref = path.resolve(local, dir, getFilename(oldHref));
      $(this).attr('href', newHref);
    }
  });
  return $.html();
};

export const removeAllSrcInHtml = (html) => {
  const $ = cheerio.load(html);
  $('script, img').each(function () {
    const oldSrc = $(this).attr('src');
    if (oldSrc !== undefined) {
      $(this).attr('src', '#');
    }
  });
  $('link').each(function () {
    const oldHref = $(this).attr('href');
    if (oldHref !== undefined) {
      $(this).attr('href', '#');
    }
  });
  return $.html();
};

export const testpromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 3000);
});
