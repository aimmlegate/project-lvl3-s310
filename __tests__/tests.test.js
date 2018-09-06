import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { promises as fsPromises } from 'fs';
import path from 'path';
import os from 'os';
import nock from 'nock';
import { getDirname, formatUrl, removeAllSrcInHtml } from '../src/utils';
import saveAsFile from '../src/';


const testurl = 'http://localhost/test';
axios.defaults.adapter = httpAdapter;


beforeAll(async () => {
  const html = await fsPromises.readFile('__tests__/__fixtures__/localhost-test.html', 'utf-8');
  const css = await fsPromises.readFile('__tests__/__fixtures__/css.css', 'utf-8');
  const img = await fsPromises.readFile('__tests__/__fixtures__/cats.jpg');
  nock('http://localhost/')
    .get('/test')
    .reply(200, html)
    .get('/cats.jpg')
    .reply(200, img)
    .get('/css.css')
    .reply(200, css);
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
  expect(removeAllSrcInHtml(html, '/test', '/test')).toBe(removeAllSrcInHtml(recivedHTML, '/test', '/test'));
});
