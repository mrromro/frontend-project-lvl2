import { describe, expect, test } from '@jest/globals';
import parser from '../src/Parser.js';

describe('Router functions test suit', () => {
  describe('added test', () => {
    const testee = {
      key: 'key',
      value: 'value',
      collection: {},
    };
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
      expect(routed).toBe('added');
    });
  });

  describe('deleted test', () => {
    const testee = {
      key: 'key',
      value: undefined,
      collection: { key: 'value' },
    };
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
      expect(routed).toBe('deleted');
    });
  });

  describe('modified test', () => {
    const testee = {
      key: 'key',
      value: 'value 2',
      collection: { key: 'value' },
    };
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
      expect(routed).toBe('modified');
    });
  });

  describe('unchanged test', () => {
    const testee = {
      key: 'key',
      value: 'value',
      collection: { key: 'value' },
    };
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
      expect(routed).toBe('unchanged');
    });
  });
});
