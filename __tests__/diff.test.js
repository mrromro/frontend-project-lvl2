import { describe, expect, test } from '@jest/globals';
import path from 'path';
import diff from '../src/diff.js';
import parser from '../src/parsers/parsers.js';

const { makeTree, compareTrees, compare } = diff;

describe('diff.makeTree tests', () => {
  test('empty call', () => {
    const received = makeTree();
    expect(received).toBeUndefined();
  });
  test('not an object value', () => {
    const testCases = [1, 'a', 'abcd', NaN, true, Infinity, null];
    testCases.forEach((value) => {
      const received = makeTree(value);
      expect(received).toBe(value);
    });
  });
  test('empty object', () => {
    const received = makeTree({});
    expect(received).toEqual([]);
  });
  test('plain object', () => {
    const received = makeTree({ key: 'value' });
    const expected = [{ key: 'key', value: 'value' }];
    expect(received).toEqual(expected);
  });
  test('nested object', () => {
    const received = makeTree({ key: { key: 'value' } });
    const expected = [
      {
        key: 'key',
        value: [
          {
            key: 'key',
            value: 'value',
          },
        ],
      },
    ];
    expect(received).toEqual(expected);
  });
});

describe('diff.compareTrees tests', () => {
  test('compare empty trees', () => {
    const received = compareTrees([], []);
    expect(received).toEqual([]);
  });
  test('equal plain trees', () => {
    const tree = makeTree({ key: 'value' });
    const received = compareTrees(tree, tree);
    expect(received).toStrictEqual(tree);
  });
  test('equal nested trees', () => {
    const tree = makeTree({ key: { key: 'value' } });
    const received = compareTrees(tree, tree);
    expect(received).toStrictEqual(tree);
  });
});

describe('compare() named tests', () => {
  const runNamedTest = (name) => {
    test(`compare ${name} objects`, async () => {
      const [oldData, newData, expected] = await parser.filesToObjects(
        path.join(__dirname, `__fixtures__/h_${name}_1.json`),
        path.join(__dirname, `__fixtures__/h_${name}_2.json`),
        path.join(__dirname, `__fixtures__/${name}.json`),
      );
      const received = compare(oldData, newData);
      expect(received).toStrictEqual(expected);
    });
  };

  runNamedTest('plain');
  runNamedTest('nested');
});
