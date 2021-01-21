import { test, describe, expect } from '@jest/globals';
import path from 'path';
import { promises as p } from 'fs';
import formatter from '../src/formatters/plain.js';
import parser from '../src/parsers/parsers.js';

const record1 = [{ key: 'key1', value: 'value1' }];
const record2 = [
  { key: 'key2', value: 'value2', type: 'added' },
  { key: 'key3', value: 'value3', type: 'removed' },
];

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
    const tree = record1.concat(record2);
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
        value: record2,
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
  test('complex plain test', async () => {
    const [difftree] = await parser.filesToObjects(
      path.join(__dirname, '__fixtures__/nested.json'),
    );
    const received = `${formatter(difftree)}\n`;
    const expected = await p.readFile(
      path.join(__dirname, '__fixtures__/nested.txt'),
      'utf-8',
    );
    expect(received).toEqual(expected);
  });
});
