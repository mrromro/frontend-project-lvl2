import { promises as fs } from 'fs';
import { join as pathjoin } from 'path';
import utils from '../src/utils.js';

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

describe('Test utility getUniqKeys', () => {
  test('empty object', () => {
    const data = {};
    const received = utils.getUniqKeys([data]);
    const expected = [];
    expect(received).toStrictEqual(expected);
  });

  test('one non-empty object', () => {
    const data = { key: 'value', 'another key': 'another value' };
    const received = utils.getUniqKeys([data]);
    const expected = ['another key', 'key'];
    expect(received).toStrictEqual(expected);
  });

  test('two non-empty object', () => {
    const data = [
      { key: 'value', 'another key': 'another value' },
      { key: 'value', 'other key': 'another value' },
    ];
    const received = utils.getUniqKeys(data);
    const expected = ['another key', 'key', 'other key'];
    expect(received).toStrictEqual(expected);
  });

  test('big object', () => {
    const { data } = objects[0];
    const received = utils.getUniqKeys([data]);
    const expected = Object.keys(data).sort();
    expect(received).toStrictEqual(expected);
  });

  test('many big objects', () => {
    const objs = objects.map(({ data }) => data);
    const received = utils.getUniqKeys(objs);
    const keys = objs
      .map((obj) => Object.keys(obj))
      .reduce(
        (acc, item) => [...acc, ...item],
        [],
      );
    const expected = [...(new Set(keys))].sort();
    expect(received).toStrictEqual(expected);
  });
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
