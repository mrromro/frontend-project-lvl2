import '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import loaders from '../src/loaders.js';

let objects;

const parseFiles = (dirAddr) => async (files) => {
  const promises = files.map(async (filename) => {
    const name = path.basename(filename);
    const extension = path.extname(filename);
    const addr = path.join(dirAddr, filename);
    const data = await fs.readFile(addr, 'utf-8');
    return {
      name,
      extension,
      addr,
      data,
    };
  });
  return Promise.all(promises);
};

const testFiles = (storage, extname, parser) => {
  const files = storage.filter(
    ({ extension }) => extension.toLowerCase() === extname,
  );
  const paths = files.map(({ addr }) => addr);
  return {
    paths,
    expected: files.map(({ data }) => parser(data)),
  };
};

beforeAll(async () => {
  const dirAddr = path.join(__dirname, '__fixtures__');
  const files = await fs.readdir(dirAddr);
  objects = await parseFiles(dirAddr)(files);
});

describe('Test file parsers', () => {
  test('JSON filesToObjects test with all json files', async () => {
    const { paths, expected } = testFiles(objects, '.json', JSON.parse);
    const received = loaders.filesToObjects(...paths);
    expect(received).toStrictEqual(expected);
  });
  test('YAML filesToObjects test with all yaml files', async () => {
    const { paths, expected } = testFiles(objects, '.yaml', yaml.load);
    const received = loaders.filesToObjects(...paths);
    expect(received).toStrictEqual(expected);
  });
});
