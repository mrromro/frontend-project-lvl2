import '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import loaders from '../src/loaders.js';

let objects;

const loader = async (filename) => {
  const file = await fs.readFile(filename, 'utf-8');
  return JSON.parse(file);
};

const parseFiles = (dirAddr) => async (files) => {
  const promises = files.map(async (filename) => {
    const name = path.basename(filename);
    const extension = path.extname(filename);
    const addr = path.join(dirAddr, filename);
    const data = await loader(addr);
    return {
      name,
      extension,
      addr,
      data,
    };
  });
  return Promise.all(promises);
};

beforeAll(async () => {
  const dirAddr = path.join(__dirname, '__fixtures__');
  const files = await fs.readdir(dirAddr);
  objects = await parseFiles(dirAddr)(files);
});

describe('Test file parsers', () => {
  test('JSONfilesToObjects test with all json files', async () => {
    const files = objects.filter(
      ({ extension }) => extension.toLowerCase() === 'json',
    );
    const paths = files.map(({ addr }) => addr);
    const expected = files.map(({ data }) => data);
    const received = loaders.JSONfilesToObjects(...paths);
    expect(received).toStrictEqual(expected);
  });
});
