import url, { URL } from 'url';
import cheerio from 'cheerio';
import _ from 'lodash';

export const formatUrl = (urlLink) => {
  const link = url.parse(urlLink);
  const newName = `${link.host}${(link.path !== '/') ? link.path : ''}`;
  return newName.replace(/[^A-Za-z0-9]/g, '-');
};

export const formatToFileName = (name, format) => `${name}.${format}`;

export const getFilename = (filepath) => {
  const filepathUrl = new URL(filepath);
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


/* eslint func-names: ["error", "never"] */

export const transformAllSrcInHtml = (html) => {
  const $ = cheerio.load(html);
  $('script, img').each(function () {
    const oldSrc = $(this).attr('src');
    if (oldSrc !== undefined) {
      const newSrc = formatUrl(oldSrc);
      $(this).attr('src', newSrc);
    }
  });
  $('link').each(function () {
    const oldHref = $(this).attr('href');
    if (oldHref !== undefined) {
      const newHref = formatUrl(oldHref);
      $(this).attr('href', newHref);
    }
  });
  return $.html();
};
