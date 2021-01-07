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
    const expected = [];
    const received = utils.getUniqKeys([data]);
    expect(received).toStrictEqual(expected);
  });

  test('one non-empty object', () => {
    const data = { key: 'value', 'another key': 'another value' };
    const expected = ['another key', 'key'];
    const received = utils.getUniqKeys([data]);
    expect(received).toStrictEqual(expected);
  });

  test('two non-empty object', () => {
    const data = [
      { key: 'value', 'another key': 'another value' },
      { key: 'value', 'other key': 'another value' },
    ];
    const expected = ['another key', 'key', 'other key'];
    const received = utils.getUniqKeys(data);
    expect(received).toStrictEqual(expected);
  });

  test('big object', () => {
    const { data } = objects[0];
    const expected = Object.keys(data).sort();
    const received = utils.getUniqKeys([data]);
    expect(received).toStrictEqual(expected);
  });

  test('many big objects', () => {
    const objs = objects.map(({ data }) => data);
    const keys = objs.map((obj) => Object.keys(obj)).flat();
    const expected = [...new Set(keys)].sort();
    const received = utils.getUniqKeys(objs);
    expect(received).toStrictEqual(expected);
  });
});

describe('Test utility findLastValue', () => {
  test('empty object', () => {
    const key = undefined;
    const collection = [];
    const expected = undefined;
    const received = utils.findLastValue(key, collection);
    expect(received).toStrictEqual(expected);
  });

  test('one object, no key', () => {
    const key = undefined;
    const collection = [{ key: 'value' }];
    const expected = undefined;
    const received = utils.findLastValue(key, collection);
    expect(received).toStrictEqual(expected);
  });

  test('one object, key to be', () => {
    const key = 'key';
    const collection = [{ key: 'value' }];
    const expected = 'value';
    const received = utils.findLastValue(key, collection);
    expect(received).toStrictEqual(expected);
  });

  test('two objects, no key', () => {
    const key = undefined;
    const collection = [{ key: 'value' }, { 'key 2': 'value 2' }];
    const expected = undefined;
    const received = utils.findLastValue(key, collection);
    expect(received).toStrictEqual(expected);
  });

  test('two objects, key to be in the first', () => {
    const key = 'key';
    const collection = [{ key: 'value' }, { 'key 2': 'value 2' }];
    const expected = 'value';
    const received = utils.findLastValue(key, collection);
    expect(received).toStrictEqual(expected);
  });

  test('two objects, key to be in the second', () => {
    const key = 'key';
    const collection = [{ 'key 2': 'value' }, { key: 'value 2' }];
    const expected = 'value 2';
    const received = utils.findLastValue(key, collection);
    expect(received).toStrictEqual(expected);
  });

  test('two objects, key to be in both', () => {
    const key = 'key';
    const collection = [{ key: 'value' }, { key: 'value 2' }];
    const expected = 'value 2';
    const received = utils.findLastValue(key, collection);
    expect(received).toStrictEqual(expected);
  });
});

describe('Test file parsers', () => {
  test('JSONfilesToObjects test with all json files', async () => {
    const files = objects.filter(
      ({ extension }) => extension.toLowerCase() === 'json',
    );
    const paths = files.map(({ path }) => path);
    const expected = files.map(({ data }) => data);
    const received = utils.JSONfilesToObjects(...paths);
    expect(received).toStrictEqual(expected);
  });
});
