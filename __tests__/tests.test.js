import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { minify } from 'html-minifier';
import nock from 'nock';
import { formatUrl } from '../src/utils';
import saveAsFile from '../src/index';

const testurl = 'http://localhost/test';
const fsPromises = fs.promises;
axios.defaults.adapter = httpAdapter;

const htmlMinifyOptions = { collapseWhitespace: true };

beforeAll(async () => {
  const expected = await fsPromises.readFile('__tests__/__fixtures__/localhost-test.html', 'utf-8');
  nock('http://localhost/')
    .get('/test')
    .reply(200, expected);
});

test('test html save to file', async () => {
  const expected = await fsPromises.readFile(`__tests__/__fixtures__/${formatUrl(testurl)}.html`, 'utf-8');
  const patchToRecived = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'page-'));
  await saveAsFile(testurl, patchToRecived);
  const recivedFile = await fsPromises.readFile(`${patchToRecived}/${formatUrl(testurl)}.html`, 'utf-8');
  expect(minify(recivedFile, htmlMinifyOptions)).toBe(minify(expected, htmlMinifyOptions));
});
