import { describe, expect, test } from '@jest/globals';
import parser from '../src/Parser.js';

describe('Router functions test suit', () => {
  test('isAdded test', () => {
    const testee = {
      key: 'key',
      value: 'value',
      collection: {},
    };
    const added = parser.router.added(testee);
    const deleted = parser.router.deleted(testee);
    const modified = parser.router.modified(testee);
    const unchanged = parser.router.unchanged(testee);
    expect(added).toBe(true);
    expect(deleted).toBe(false);
    expect(modified).toBe(false);
    expect(unchanged).toBe(false);
  });

  test('isDeleted test', () => {
    const testee = {
      key: 'key',
      value: undefined,
      collection: { key: 'value' },
    };
    const added = parser.router.added(testee);
    const deleted = parser.router.deleted(testee);
    const modified = parser.router.modified(testee);
    const unchanged = parser.router.unchanged(testee);
    expect(added).toBe(false);
    expect(deleted).toBe(true);
    expect(modified).toBe(false);
    expect(unchanged).toBe(false);
  });

  test('isModified test', () => {
    const testee = {
      key: 'key',
      value: 'value 2',
      collection: { key: 'value' },
    };
    const added = parser.router.added(testee);
    const deleted = parser.router.deleted(testee);
    const modified = parser.router.modified(testee);
    const unchanged = parser.router.unchanged(testee);
    expect(added).toBe(false);
    expect(deleted).toBe(false);
    expect(modified).toBe(true);
    expect(unchanged).toBe(false);
  });

  test('isUnchanged test', () => {
    const testee = {
      key: 'key',
      value: 'value',
      collection: { key: 'value' },
    };
    const added = parser.router.added(testee);
    const deleted = parser.router.deleted(testee);
    const modified = parser.router.modified(testee);
    const unchanged = parser.router.unchanged(testee);
    expect(added).toBe(false);
    expect(deleted).toBe(false);
    expect(modified).toBe(false);
    expect(unchanged).toBe(true);
  });
});
