import { describe, expect, test } from '@jest/globals';
import parser from '../src/Parser.js';

describe('Router functions test suit', () => {
  describe('added test', () => {
    const testee = {
      key: 'key',
      value: 'value',
      collection: {},
    };

    const type = 'added';
    let payload;

    test('predicates test', () => {
      const added = parser.router.added(testee);
      const deleted = parser.router.deleted(testee);
      const modified = parser.router.modified(testee);
      const unchanged = parser.router.unchanged(testee);
      expect(added).toBe(true);
      expect(deleted).toBe(false);
      expect(modified).toBe(false);
      expect(unchanged).toBe(false);
    });
    test('router test', () => {
      const routed = parser.testKey(testee);
      expect(routed).toBe(type);
    });
    test('makePayload test', () => {
      payload = parser.constructor.makePayload(type, testee);
      const { key, value } = testee;
      expect(payload).toStrictEqual({ [key]: value });
    });
    test('process test', () => {
      const received = parser.process(testee);
      expect(received).toStrictEqual({ type, payload });
    });
  });

  describe('deleted test', () => {
    const testee = {
      key: 'key',
      value: undefined,
      collection: { key: 'value' },
    };

    const type = 'deleted';
    let payload;

    test('predicates test', () => {
      const added = parser.router.added(testee);
      const deleted = parser.router.deleted(testee);
      const modified = parser.router.modified(testee);
      const unchanged = parser.router.unchanged(testee);
      expect(added).toBe(false);
      expect(deleted).toBe(true);
      expect(modified).toBe(false);
      expect(unchanged).toBe(false);
    });
    test('router test', () => {
      const routed = parser.testKey(testee);
      expect(routed).toBe(type);
    });
    test('makePayload test', () => {
      payload = parser.constructor.makePayload(type, testee);
      const { key, collection } = testee;
      expect(payload).toStrictEqual({ [key]: collection[key] });
    });
    test('process test', () => {
      const received = parser.process(testee);
      expect(received).toStrictEqual({ type, payload });
    });
  });

  describe('modified test', () => {
    const testee = {
      key: 'key',
      value: 'value 2',
      collection: { key: 'value' },
    };

    const type = 'modified';
    let payload;

    test('predicates test', () => {
      const added = parser.router.added(testee);
      const deleted = parser.router.deleted(testee);
      const modified = parser.router.modified(testee);
      const unchanged = parser.router.unchanged(testee);
      expect(added).toBe(false);
      expect(deleted).toBe(false);
      expect(modified).toBe(true);
      expect(unchanged).toBe(false);
    });
    test('router test', () => {
      const routed = parser.testKey(testee);
      expect(routed).toBe(type);
    });
    test('makePayload test', () => {
      payload = parser.constructor.makePayload(type, testee);
      const { key, collection, value } = testee;
      expect(payload).toStrictEqual({ [key]: collection[key], changed: value });
    });
    test('process test', () => {
      const received = parser.process(testee);
      expect(received).toStrictEqual({ type, payload });
    });
  });

  describe('unchanged test', () => {
    const testee = {
      key: 'key',
      value: 'value',
      collection: { key: 'value' },
    };

    const type = 'unchanged';
    let payload;

    test('isUnchanged test', () => {
      const added = parser.router.added(testee);
      const deleted = parser.router.deleted(testee);
      const modified = parser.router.modified(testee);
      const unchanged = parser.router.unchanged(testee);
      expect(added).toBe(false);
      expect(deleted).toBe(false);
      expect(modified).toBe(false);
      expect(unchanged).toBe(true);
    });
    test('router test', () => {
      const routed = parser.testKey(testee);
      expect(routed).toBe(type);
    });
    test('makePayload test', () => {
      payload = parser.constructor.makePayload(type, testee);
      const { key, collection, value } = testee;
      expect(payload).toStrictEqual({ [key]: value });
      expect(payload).toStrictEqual({ [key]: collection[key] });
    });
    test('process test', () => {
      const received = parser.process(testee);
      expect(received).toStrictEqual({ type, payload });
    });
  });
});
