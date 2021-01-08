import { describe, expect, test } from '@jest/globals';
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

describe('Router functions test suit', () => {
  describe('added test', () => {
    const type = 'added';
    const { [type]: testee } = testeesBook;

    test('router test', () => {
      const routed = testType(testee);
      expect(routed).toBe(type);
    });
  });

  describe('deleted test', () => {
    const type = 'deleted';
    const { [type]: testee } = testeesBook;

    test('router test', () => {
      const routed = testType(testee);
      expect(routed).toBe(type);
    });
  });

  describe('modified test', () => {
    const type = 'modified';
    const { [type]: testee } = testeesBook;

    test('router test', () => {
      const routed = testType(testee);
      expect(routed).toBe(type);
    });
  });

  describe('unchanged test', () => {
    const type = 'unchanged';
    const { [type]: testee } = testeesBook;

    test('router test', () => {
      const routed = testType(testee);
      expect(routed).toBe(type);
    });
  });
});
