import { expect, test } from '@jest/globals';
import testType from '../src/router.js';

const testeesBook = {
  added: {
    key: 'key',
    value: 'value',
    collection: {},
  },
  deleted: {
    key: 'key',
    value: undefined,
    collection: { key: 'value' },
  },
  modified: {
    key: 'key',
    value: 'value 2',
    collection: { key: 'value' },
  },
  unchanged: {
    key: 'key',
    value: 'value',
    collection: { key: 'value' },
  },
};

test('all cases at once', () => {
  Object.entries(testeesBook).forEach(([key, value]) => {
    const expected = key;
    const received = testType(value);
    expect(received).toBe(expected);
  });
});
