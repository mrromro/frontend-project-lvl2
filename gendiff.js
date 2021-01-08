#!/usr/bin/env node
import program, { output } from './src/cli.js';
import utils from './src/utils.js';
import parser from './src/parsers.js';
import render from './src/render.js';
import testType from './src/router.js';

function compareObjects(...objects) {
  const keys = utils.getUniqKeys(objects);
  const [first, ...rest] = objects;
  return keys.map((key) => {
    const collection = first;
    const value = utils.findLastValue(key, rest);
    const type = testType({ key, value, collection });
    switch (type) {
      case 'added':
        return { type, payload: { key, value } };
      case 'deleted':
        return { type, payload: { key, value: collection[key] } };
      case 'unchanged':
        return { type, payload: { key, value: collection[key] } };
      case 'modified': {
        if (typeof collection[key] === 'object') {
          return {
            type: 'unchanged',
            payload: {
              key,
              value: compareObjects(
                ...objects.map((obj) => obj[key]).filter(Boolean),
              ),
            },
          };
        }
        return {
          type,
          payload: { key, value: collection[key], newValue: value },
        };
      }
      default:
        throw new Error('unknown happens');
    }
  });
}

program.action((filepath1, filepath2) => {
  const [file1, file2] = parser.filesToObjects(filepath1, filepath2);
  const compareResult = compareObjects(file1, file2);
  output(compareResult);
  const result = render(compareResult);
  output(result);
});

program.parse(process.argv);

export default compareObjects;
