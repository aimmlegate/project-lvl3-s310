import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import nock from 'nock';
import { formatUrl, fileCreate } from '../src/utils/utils';
import beautify from 'js-beautify'

const host = 'http://localhost';
const testurl = 'http://localhost/test'
const htmlBeutify = beautify.html;
const fsPromises = fs.promises;

axios.defaults.adapter = httpAdapter;
axios.defaults.host = host;

beforeAll(async () => {
  const expected = await fsPromises.readFile('__tests__/__fixtures__/localhost-test.html', 'utf-8');
  nock(host)
    .get('/test')
    .reply(200, expected);
});

test('test html save to file', async () => {
  const expected = await fsPromises.readFile(`__tests__/__fixtures__/${formatUrl(testurl)}.html`, 'utf-8');
  const patchToRecived = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'page-'));
  const test = await fileCreate(testurl, patchToRecived);
  const recivedFile = await fsPromises.readFile(`${patchToRecived}/${formatUrl(testurl)}.html`, 'utf-8');
  expect(htmlBeutify(recivedFile)).toBe(htmlBeutify(expected));
});
