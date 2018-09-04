import url, { URL } from 'url';
import path from 'path';
import cheerio from 'cheerio';
import _ from 'lodash';

const formatUrl = (urlLink) => {
  const link = url.parse(urlLink);
  const newName = `${link.host}${(link.path !== '/') ? link.path : ''}`;
  return newName.replace(/[^A-Za-z0-9]/g, '-');
};

const formatToFileName = (name, format) => `${name}.${format}`;

const getFilename = (filepath) => {
  const filepathUrl = new URL(filepath);
  return filepathUrl.pathname.split('/').filter(v => v !== '').join('-');
};

const getAllSrcFromHtml = (html) => {
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

/* eslint func-names: ["error", "never"] */

const transformAllSrcInHtml = (html) => {
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

const filterLocalLinks = linksArray =>
  linksArray.filter((urlElem) => {
    const checkUrl = new URL(urlElem, 'http://dumb.ass');
    return (checkUrl.origin === 'http://dumb.ass') ? checkUrl.pathname : false;
  });


export { formatUrl, formatToFileName, getAllSrcFromHtml, filterLocalLinks, getFilename, transformAllSrcInHtml };
