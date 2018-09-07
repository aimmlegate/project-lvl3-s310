import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { promises as fsPromises } from 'fs';
import path from 'path';
import os from 'os';
import nock from 'nock';
import { getDirname, formatUrl, transformAllSrcInHtml } from '../src/utils';
import saveAsFile from '../src/';


const testurl = 'http://localhost/test';
const testurlEr = 'http://localhost/test-err';
axios.defaults.adapter = httpAdapter;


beforeAll(async () => {
  const html = await fsPromises.readFile('__tests__/__fixtures__/localhost-test.html', 'utf-8');
  const htmlEr = await fsPromises.readFile('__tests__/__fixtures__/localhost-test-errors.html', 'utf-8');
  const css = await fsPromises.readFile('__tests__/__fixtures__/css.css', 'utf-8');
  const img = await fsPromises.readFile('__tests__/__fixtures__/cats.jpg');
  nock('http://localhost/')
    .get('/test')
    .reply(200, html)
    .get('/test-err')
    .reply(200, htmlEr)
    .get('/cats.jpg')
    .reply(200, img)
    .get('/css.css')
    .reply(200, css);
  nock('http://localhost/')
    .get('/403')
    .reply(403)
    .get('/404')
    .reply(404)
    .get('/429')
    .reply(429)
    .get('/500')
    .reply(500)
    .get('/503')
    .reply(503)
    .get('/brbr')
    .reply(404)
    .get('/brbrbr')
    .reply(500);
});

test('test html save to file', async () => {
  const html = await fsPromises.readFile('__tests__/__fixtures__/localhost-test.html', 'utf-8');
  const patchToRecived = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'page-'));
  const pathToRecivedAssets = path.resolve(patchToRecived, getDirname(testurl));

  await saveAsFile(testurl, patchToRecived);

  const dirFiles = await fsPromises.readdir(patchToRecived, 'utf8');
  const dirFilesAssets = await fsPromises.readdir(pathToRecivedAssets, 'utf8');
  const recivedHTML = await fsPromises.readFile(`${patchToRecived}/${formatUrl(testurl)}.html`, 'utf-8');

  expect(dirFiles).toEqual(['localhost-test.html', 'localhost-test__files']);
  expect(dirFilesAssets).toEqual(['cats.jpg', 'css.css']);
  expect(transformAllSrcInHtml(html, '/', '/', true)).toBe(transformAllSrcInHtml(recivedHTML, '/', '/', true));
});

test('test html save to file, assets err', async () => {
  const html = await fsPromises.readFile('__tests__/__fixtures__/localhost-test-errors.html', 'utf-8');
  const patchToRecived = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'page-'));

  await saveAsFile(testurlEr, patchToRecived);

  const dirFiles = await fsPromises.readdir(patchToRecived, 'utf8');
  const recivedHTML = await fsPromises.readFile(`${patchToRecived}/${formatUrl(testurlEr)}.html`, 'utf-8');

  expect(dirFiles).toEqual(['localhost-test-err.html', 'localhost-test-err__files']);
  expect(transformAllSrcInHtml(html, '/', '/', true)).toBe(transformAllSrcInHtml(recivedHTML, '/', '/', true));
});

test('throw error url dont exist', async () => {
  const patchToRecived = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'page-'));
  try {
    await saveAsFile('http://dumb.ass', patchToRecived);
  } catch (e) {
    expect(e.code).toBe('ENOTFOUND');
  }
});

test('throw error directory dont exist', async () => {
  try {
    await saveAsFile('https://ru.hexlet.io', '/ssssss');
  } catch (e) {
    expect(e.code).toBe('ENOENT');
  }
});

test('net errors', async () => {
  try {
    await saveAsFile('http://localhost/403', '/');
  } catch (e) {
    expect(e.response.status).toBe(403);
  }
  try {
    await saveAsFile('http://localhost/404', '/');
  } catch (e) {
    expect(e.response.status).toBe(404);
  }
  try {
    await saveAsFile('http://localhost/429', '/');
  } catch (e) {
    expect(e.response.status).toBe(429);
  }
  try {
    await saveAsFile('http://localhost/500', '/');
  } catch (e) {
    expect(e.response.status).toBe(500);
  }
  try {
    await saveAsFile('http://localhost/503', '/');
  } catch (e) {
    expect(e.response.status).toBe(503);
  }
});
