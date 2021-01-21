import { describe, expect, test } from '@jest/globals';
import path from 'path';
import diff from '../src/diff.js';
import parser from '../src/parsers/parsers.js';

const { makeTree, compareTrees, compare } = diff;
const finalTree = [
  {
    key: 'key',
    value: [
      {
        key: 'key',
        type: 'updated',
        value: 'value',
        newValue: 'value-modified',
      },
    ],
  },
];
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
  test('different plain trees', () => {
    const oldTree = makeTree({ key: 'value' });
    const newTree = makeTree({ key: 'value-modified' });
    const received = compareTrees(oldTree, newTree);
    const expected = [
      {
        key: 'key',
        type: 'updated',
        value: 'value',
        newValue: 'value-modified',
      },
    ];
    expect(received).toStrictEqual(expected);
  });
  test('different nestes trees', () => {
    const oldTree = makeTree({ key: { key: 'value' } });
    const newTree = makeTree({ key: { key: 'value-modified' } });
    const received = compareTrees(oldTree, newTree);
    expect(received).toStrictEqual(finalTree);
  });
});

test('compare nested objects', () => {
  const oldData = { key: { key: 'value' } };
  const newData = { key: { key: 'value-modified' } };
  const received = compare(oldData, newData);
  expect(received).toStrictEqual(finalTree);
});

test('compare complex objects', async () => {
  const [oldData, newData, expected] = await parser.filesToObjects(
    path.join(__dirname, '__fixtures__/h_nested_1.json'),
    path.join(__dirname, '__fixtures__/h_nested_2.json'),
    path.join(__dirname, '__fixtures__/nested.json'),
  );
  const received = compare(oldData, newData);
  expect(received).toStrictEqual(expected);
});
