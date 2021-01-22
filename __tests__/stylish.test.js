import { describe, test } from '@jest/globals';
import path from 'path';
import { promises as p } from 'fs';
import parser from '../src/parsers/parsers.js';
import formatter from '../src/formatters/stylish.js';

describe('stylish formatter tests', () => {
  test('empty tree test', () => {
    const received = formatter([]);
    const expected = ['{', '', '}'].join('\n');
    expect(received).toBe(expected);
  });
  test('plain tree test', () => {
    const tree = [{ key: 'key', value: 'value' }];
    const received = formatter(tree);
    const expected = ['{', '    key: value', '}'].join('\n');
    expect(received).toBe(expected);
  });

  const runNamedTest = (name) => test(`complex ${name} test`, async () => {
    const [difftree] = await parser.filesToObjects(
      path.join(__dirname, `__fixtures__/${name}.json`),
    );
    const received = formatter(difftree);
    const expected = await p.readFile(
      path.join(__dirname, `__fixtures__/${name}_s.txt`),
      'utf-8',
    );
    expect(received).toEqual(expected);
  });

  runNamedTest('plain');
  runNamedTest('nested');
});
