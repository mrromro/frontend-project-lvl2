import { describe, expect, test } from '@jest/globals';
import parser from '../src/Parser.js';

const predicateTest = ((router) => (testee) => {
  const entries = Object.entries(router);
  return entries.reduce((acc, [key, predicate]) => {
    if (predicate(testee)) return [...acc, key];
    return acc;
  }, []);
})(parser.router);

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

const results = {};

describe('Router functions test suit', () => {
  describe('added test', () => {
    const type = 'added';
    const { [type]: testee } = testeesBook;

    test('predicates test', () => {
      const received = predicateTest(testee);
      expect(received).toStrictEqual([type]);
    });
    test('router test', () => {
      const routed = parser.testKey(testee);
      expect(routed).toBe(type);
    });
    test('makePayload test', () => {
      results[type] = parser.constructor.makePayload(type, testee);
      const { key, value } = testee;
      expect(results[type]).toStrictEqual({ [key]: value });
    });
  });

  describe('deleted test', () => {
    const type = 'deleted';
    const { [type]: testee } = testeesBook;

    test('predicates test', () => {
      const received = predicateTest(testee);
      expect(received).toStrictEqual([type]);
    });
    test('router test', () => {
      const routed = parser.testKey(testee);
      expect(routed).toBe(type);
    });
    test('makePayload test', () => {
      results[type] = parser.constructor.makePayload(type, testee);
      const { key, collection } = testee;
      expect(results[type]).toStrictEqual({ [key]: collection[key] });
    });
  });

  describe('modified test', () => {
    const type = 'modified';
    const { [type]: testee } = testeesBook;

    test('predicates test', () => {
      const received = predicateTest(testee);
      expect(received).toStrictEqual([type]);
    });
    test('router test', () => {
      const routed = parser.testKey(testee);
      expect(routed).toBe(type);
    });
    test('makePayload test', () => {
      results[type] = parser.constructor.makePayload(type, testee);
      const { key, collection, value } = testee;
      expect(results[type]).toStrictEqual({
        [key]: collection[key],
        changed: value,
      });
    });
  });

  describe('unchanged test', () => {
    const type = 'unchanged';
    const { [type]: testee } = testeesBook;

    test('isUnchanged test', () => {
      const received = predicateTest(testee);
      expect(received).toStrictEqual([type]);
    });
    test('router test', () => {
      const routed = parser.testKey(testee);
      expect(routed).toBe(type);
    });
    test('makePayload test', () => {
      results[type] = parser.constructor.makePayload(type, testee);
      const { key, collection, value } = testee;
      expect(results[type]).toStrictEqual({ [key]: value });
      expect(results[type]).toStrictEqual({ [key]: collection[key] });
    });
  });

  test('process test', () => {
    const types = Object.keys(testeesBook);
    types.forEach((type) => {
      const { [type]: testee } = testeesBook;
      const { [type]: payload } = results;
      expect(parser.process(testee)).toStrictEqual({ type, payload });
    });
  });
});
