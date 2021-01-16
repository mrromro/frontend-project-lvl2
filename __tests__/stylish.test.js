import { describe, test } from '@jest/globals';
import formatter from '../src/formatters/stylish.js';

describe('stylish formatter tests', () => {
  test('empty tree test', () => {
    const received = formatter([]);
    const expected = ['{', '', '}'].join('\n');
    expect(received).toBe(expected);
  });
  test('plain tree test', () => {
    const tree = [{ key: 'key', value: 'value', type: 'unchanged' }];
    const received = formatter(tree);
    const expected = ['{', '    key: value', '}'].join('\n');
    expect(received).toBe(expected);
  });
  test('plain tree essential test', () => {
    const tree = [
      { key: 'key1', value: 'value1', type: 'unchanged' },
      { key: 'key2', value: 'value2', type: 'added' },
      { key: 'key3', value: 'value3', type: 'deleted' },
    ];
    const received = formatter(tree);
    const expected = [
      '{',
      '    key1: value1',
      '  + key2: value2',
      '  - key3: value3',
      '}',
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
      '{',
      '    key1: {',
      '      + key2: value2',
      '      - key3: value3',
      '    }',
      '    key4: value4',
      '}',
    ].join('\n');
    expect(received).toBe(expected);
  });
});
