import { test, describe, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import plain from '../src/formatters/plain.js';
import stylish from '../src/formatters/stylish.js';
import parser from '../src/parsers/parsers.js';

const runNamedTest = (options) => {
  const { difftreeFilename, resultFilename, formatter } = options;
  test(`complex ${formatter.name} test`, () => {
    const [difftree] = parser.filesToObjects([
      path.join(__dirname, `__fixtures__/${difftreeFilename}.json`),
    ]);
    const received = formatter(difftree);
    const expected = fs.readFileSync(
      path.join(__dirname, `__fixtures__/${resultFilename}.txt`),
      'utf-8',
    );
    expect(received).toEqual(expected);
  });
};

describe('plain formatter test', () => {
  test('empty tree test', () => {
    const received = plain([]);
    expect(received).toBe('');
  });
  test('plain tree test', () => {
    const tree = [{ key: 'key', value: 'value' }];
    const received = plain(tree);
    expect(received).toBe('');
  });

  runNamedTest({
    formatter: plain,
    difftreeFilename: 'plain',
    resultFilename: 'plain',
  });
  runNamedTest({
    formatter: plain,
    difftreeFilename: 'nested',
    resultFilename: 'nested',
  });
});

describe('stylish formatter tests', () => {
  test('empty tree test', () => {
    const received = stylish([]);
    const expected = ['{', '', '}'].join('\n');
    expect(received).toBe(expected);
  });
  test('plain tree test', () => {
    const tree = [{ key: 'key', value: 'value' }];
    const received = stylish(tree);
    const expected = ['{', '    key: value', '}'].join('\n');
    expect(received).toBe(expected);
  });

  runNamedTest({
    formatter: stylish,
    difftreeFilename: 'plain',
    resultFilename: 'plain_s',
  });
  runNamedTest({
    formatter: stylish,
    difftreeFilename: 'nested',
    resultFilename: 'nested_s',
  });
});
