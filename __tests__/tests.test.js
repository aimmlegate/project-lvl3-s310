import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { formatUrl, fileCreate } from '../src/utils/utils';
axios.defaults.adapter = httpAdapter;

const testUrl = 'https://hexlet.io/courses';

test('format url', () => {
  const expected = 'hexlet-io-courses';
  const received = formatUrl(testUrl);
  expect(received).toBe(expected);
});
