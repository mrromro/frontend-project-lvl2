import { describe, test, expect } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import loaders from '../src/loaders.js';
import jsonFile from './__fixtures__/flat1.json';

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

test('chooseLoader() test', () => {
  const yamlFilename = 'file.yaml';
  const jsonFilename = 'file.json';
  const unknownName = 'file.xxx';

  expect(loaders.chooseLoader(yamlFilename)).toBe(yaml.load);
  expect(loaders.chooseLoader(jsonFilename)).toBe(JSON.parse);
  expect(() => loaders.chooseLoader(unknownName)).toThrow(Error);
});

describe('Test file parsers by one file', () => {
  test('JSON filesToObject test with all json file', async () => {
    const expected = jsonFile;
    const received = loaders.fileToObject(
      path.join(__dirname, '__fixtures__/flat1.json'),
    );
    expect(received).toStrictEqual(expected);
  });
  test('YAML filesToObject test with all yaml file', async () => {
    const addr = path.join(__dirname, '__fixtures__/flat1.yaml');
    const data = await fs.readFile(addr, 'utf-8');
    const expected = yaml.load(data);
    const received = loaders.fileToObject(addr);
    expect(received).toStrictEqual(expected);
  });
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
