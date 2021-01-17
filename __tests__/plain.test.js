import { test, describe } from '@jest/globals';
import formatter from '../src/formatters/plain.js';

describe('plain formatter test', () => {
  test('empty tree test', () => {
    const received = formatter([]);
    expect(received).toBe('');
  });
  test('plain tree test', () => {
    const tree = [{ key: 'key', value: 'value' }];
    const received = formatter(tree);
    expect(received).toBe('');
  });
  test('plain tree essential test', () => {
    const tree = [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2', type: 'added' },
      { key: 'key3', value: 'value3', type: 'removed' },
    ];
    const received = formatter(tree);
    const expected = [
      "Property 'key2' was added with value: 'value2'",
      "Property 'key3' was removed",
    ].join('\n');
    expect(received).toBe(expected);
  });
  test('nested tree essential test', () => {
    const tree = [
      {
        key: 'key1',
        value: [
          { key: 'key2', value: 'value2', type: 'added' },
          { key: 'key3', value: 'value3', type: 'removed' },
        ],
      },
      { key: 'key4', value: 'value4' },
    ];
    const received = formatter(tree);
    const expected = [
      "Property 'key1.key2' was added with value: 'value2'",
      "Property 'key1.key3' was removed",
    ].join('\n');
    expect(received).toBe(expected);
  });
  test('nested tree extended test', () => {
    const tree = [
      {
        key: 'key1',
        value: [
          {
            key: 'key3',
            value: 'value3',
            newValue: 'value33',
            type: 'updated',
          },
          { key: 'key6', value: 'value6' },
        ],
      },
      { key: 'key4', value: 'value4' },
      {
        key: 'key5',
        value: 'value5',
        newValue: 'value5-updated',
        type: 'updated',
      },
    ];
    const received = formatter(tree);
    const expected = [
      "Property 'key1.key3' was updated. From 'value3' to 'value33'",
      "Property 'key5' was updated. From 'value5' to 'value5-updated'",
    ].join('\n');
    expect(received).toBe(expected);
  });
});
