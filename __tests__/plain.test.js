import { test, describe } from '@jest/globals';
import formatter from '../src/formatters/plain.js';

describe('plain formatter test', () => {
  test('empty tree test', () => {
    const received = formatter([]);
    expect(received).toBe('');
  });
  test('plain tree test', () => {
    const tree = [{ key: 'key', value: 'value', type: 'unchanged' }];
    const received = formatter(tree);
    expect(received).toBe('');
  });
  test('plain tree essential test', () => {
    const tree = [
      { key: 'key1', value: 'value1', type: 'unchanged' },
      { key: 'key2', value: 'value2', type: 'added' },
      { key: 'key3', value: 'value3', type: 'deleted' },
    ];
    const received = formatter(tree);
    const expected = [
      "Property 'key2' was added with value: value2",
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
          { key: 'key3', value: 'value3', type: 'deleted' },
        ],
        type: 'unchanged',
      },
      { key: 'key4', value: 'value4', type: 'unchanged' },
    ];
    const received = formatter(tree);
    const expected = [
      "Property 'key1.key2' was added with value: value2",
      "Property 'key1.key3' was removed",
    ].join('\n');
    expect(received).toBe(expected);
  });
});
