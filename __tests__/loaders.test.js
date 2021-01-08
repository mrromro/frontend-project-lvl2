import { describe, test } from '@jest/globals';
import { promises as fs } from 'fs';
import { join as pathjoin } from 'path';
import loaders from '../src/loaders.js';

let objects;

const loader = async (filename) => {
  const file = await fs.readFile(filename, 'utf-8');
  return JSON.parse(file);
};

const parseFiles = (dirAddr) => async (files) => {
  const promises = files.map(async (filename) => {
    const [name, extension] = filename.split('.');
    const path = pathjoin(dirAddr, filename);
    const data = await loader(path);
    return {
      name,
      extension,
      path,
      data,
    };
  });
  return Promise.all(promises);
};

beforeAll(async () => {
  const dirAddr = pathjoin(__dirname, '__fixtures__');
  const files = await fs.readdir(dirAddr);
  objects = await parseFiles(dirAddr)(files);
});

describe('Test file parsers', () => {
  test('JSONfilesToObjects test with all json files', async () => {
    const files = objects.filter(
      ({ extension }) => extension.toLowerCase() === 'json',
    );
    const paths = files.map(({ path }) => path);
    const expected = files.map(({ data }) => data);
    const received = loaders.JSONfilesToObjects(...paths);
    expect(received).toStrictEqual(expected);
  });
});
