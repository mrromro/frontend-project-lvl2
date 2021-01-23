import { describe, test, expect } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import parsers from '../src/parsers/parsers.js';
import jsonFile from './__fixtures__/h_plain_1.json';

const objects = [];
const EXTENSIONS = ['.json', '.yaml', '.yml'];

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

beforeAll(async () => {
  const dirAddr = path.join(__dirname, '__fixtures__');
  const files = await fs.readdir(dirAddr);
  const allFilesObj = await parseFiles(dirAddr)(files);
  objects.push(...allFilesObj.filter(({ ext }) => EXTENSIONS.includes(ext)));
});

test('chooseLoader() test', () => {
  const yamlFilename = 'file.yaml';
  const jsonFilename = 'file.json';
  const unknownName = 'file.xxx';

  expect(parsers.chooseLoader(yamlFilename)).toBe(yaml.load);
  expect(parsers.chooseLoader(jsonFilename)).toBe(JSON.parse);
  expect(() => parsers.chooseLoader(unknownName)).toThrow(Error);
});

describe('Test file parsers by one file', () => {
  test('JSON filesToObject test with all json file', async () => {
    const expected = jsonFile;
    const received = await parsers.fileToObject(
      path.join(__dirname, '__fixtures__/h_plain_1.json'),
    );
    expect(received).toStrictEqual(expected);
  });
  test('YAML filesToObject test with all yaml file', async () => {
    const addr = path.join(__dirname, '__fixtures__/h_plain_1.yaml');
    const data = await fs.readFile(addr, 'utf-8');
    const expected = yaml.load(data);
    const received = await parsers.fileToObject(addr);
    expect(received).toStrictEqual(expected);
  });
});

test('filesToObjects test with all json files', async () => {
  const paths = objects.map(({ addr }) => addr);
  const expected = objects.map(({ data, addr }) => {
    const loader = parsers.chooseLoader(addr);
    return loader(data);
  });
  const received = parsers.filesToObjects(paths);
  expect(received).toStrictEqual(expected);
});
