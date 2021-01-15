import '@jest/globals';
import utils from '../src/utils.js';
import testJson1 from './__fixtures__/flat1.json';
import testJson2 from './__fixtures__/flat2.json';

describe('Test utility getUniqKeys', () => {
  test('empty object', () => {
    const data = {};
    const expected = [];
    const received = utils.getUniqKeys([data]);
    expect(received).toStrictEqual(expected);
  });

  test('one non-empty object', () => {
    const data = {
      key: 'value',
      'another key': 'another value',
    };
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
    const data = testJson1;
    const expected = Object.keys(data).sort();
    const received = utils.getUniqKeys([data]);
    expect(received).toStrictEqual(expected);
  });

  test('two big objects', () => {
    const objs = [testJson1, testJson2];
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
