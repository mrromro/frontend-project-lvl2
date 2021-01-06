import { promises as fs } from 'fs';
import { join as pathjoin } from 'path';
import utils from '../utils.js';

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
    const received = utils.JSONfilesToObjects(...paths);
    const expected = files.map(({ data }) => data);
    expect(received).toStrictEqual(expected);
  });
});
