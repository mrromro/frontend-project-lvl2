import { test, describe, expect } from '@jest/globals';
import path from 'path';
import { promises as p } from 'fs';
import plain from '../src/formatters/plain.js';
import stylish from '../src/formatters/stylish.js';
import parser from '../src/parsers/parsers.js';

const makeNamedTest = (formatter) => (
  {
    difftreeFilename,
    resultFilename,
  },
) => test(
  `complex ${formatter.name} test`,
  async () => {
    const [difftree] = await parser.filesToObjects(
      path.join(__dirname, `__fixtures__/${difftreeFilename}.json`),
    );
    const received = formatter(difftree);
    const expected = await p.readFile(
      path.join(__dirname, `__fixtures__/${resultFilename}.txt`),
      'utf-8',
    );
    expect(received).toEqual(expected);
  },
);

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

  const runPlainNamedTest = makeNamedTest(plain);
  runPlainNamedTest(
    {
      difftreeFilename: 'plain',
      resultFilename: 'plain',
    },
  );
  runPlainNamedTest(
    {
      difftreeFilename: 'nested',
      resultFilename: 'nested',
    },
  );
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

  const runStylishNamedTest = makeNamedTest(stylish);
  runStylishNamedTest(
    {
      difftreeFilename: 'plain',
      resultFilename: 'plain_s',
    },
  );
  runStylishNamedTest(
    {
      difftreeFilename: 'nested',
      resultFilename: 'nested_s',
    },
  );
});
