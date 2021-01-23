import { describe, test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import parsers from '../src/parsers/parsers.js';

const EXTENSIONS = ['.json', '.yaml', '.yml'];

const parseFiles = (dirAddr) => (files) => {
  const promises = files.map((filename) => {
    const name = path.basename(filename);
    const extension = path.extname(filename);
    const addr = path.join(dirAddr, filename);
    const data = fs.readFileSync(addr, 'utf-8');
    return {
      name,
      extension,
      addr,
      data,
    };
  });
  return promises;
};

const getResults = (addr, loader) => {
  const fullAddr = path.resolve(addr);
  const data = fs.readFileSync(fullAddr, 'utf-8');
  const received = parsers.fileToObject(addr);
  const expected = loader(data);
  return { received, expected };
};

test('chooseLoader() test', () => {
  const yamlFilename = 'file.yaml';
  const jsonFilename = 'file.json';
  const unknownName = 'file.xxx';

  expect(parsers.chooseLoader(yamlFilename)).toBe(yaml.load);
  expect(parsers.chooseLoader(jsonFilename)).toBe(JSON.parse);
  expect(() => parsers.chooseLoader(unknownName)).toThrow(Error);
});

describe('Test file parsers by one file', () => {
  const cases = [
    {
      name: 'JSON',
      addr: '__tests__/__fixtures__/h_plain_1.json',
      loader: JSON.parse,
    },
    {
      name: 'YAML',
      addr: '__tests__/__fixtures__/h_plain_1.yaml',
      loader: yaml.load,
    },
  ];
  cases.forEach(({ name, addr, loader }) => {
    test(`${name} fileToObject test`, () => {
      const { received, expected } = getResults(
        addr,
        loader,
      );
      expect(received).toStrictEqual(expected);
    });
  });
});

test('filesToObjects test with all files', async () => {
  const dirAddr = path.join(__dirname, '__fixtures__');
  const files = fs.readdirSync(dirAddr);
  const allFilesObj = parseFiles(dirAddr)(files);
  const objects = allFilesObj.filter(({ ext }) => EXTENSIONS.includes(ext));
  const paths = objects.map(({ addr }) => addr);
  const expected = objects.map(({ data, addr }) => {
    const loader = parsers.chooseLoader(addr);
    return loader(data);
  });
  const received = parsers.filesToObjects(paths);
  expect(received).toStrictEqual(expected);
});
