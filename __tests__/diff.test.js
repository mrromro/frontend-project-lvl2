import { describe, expect, test } from '@jest/globals';
import diff from '../src/diff.js';

const { makeTree, compareTrees, compare } = diff;
const finalTree = [
  {
    key: 'key',
    type: 'unchanged',
    value: [
      { key: 'key', type: 'deleted', value: 'value' },
      { key: 'key', type: 'added', value: 'value-modified' },
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
    const expected = [{ key: 'key', type: 'unchanged', value: 'value' }];
    expect(received).toEqual(expected);
  });
  test('nested object', () => {
    const received = makeTree({ key: { key: 'value' } });
    const expected = [
      {
        key: 'key',
        type: 'unchanged',
        value: [
          {
            key: 'key',
            type: 'unchanged',
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
      { key: 'key', type: 'deleted', value: 'value' },
      { key: 'key', type: 'added', value: 'value-modified' },
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
