#!/usr/bin/env node
import program, { output } from './src/cli.js';
import utils from './src/utils.js';
import parser from './src/parsers.js';
import render from './src/render.js';
import testType from './src/router.js';

function router(objects, callback) {
  return function makeRecord(type) {
    return {
      added: ({ key, value }) => ({ type, payload: { key, value } }),
      deleted: ({ key, collection }) => ({
        type,
        payload: { key, value: collection[key] },
      }),
      get unchanged() {
        return this.deleted;
      },
      modified: ({ key, value, collection }) => ({
        type,
        payload: { key, value: collection[key], newValue: value },
      }),
      modifiedObject: ({ key }) => ({
        type,
        payload: {
          key,
          value: callback(...objects.map((obj) => obj[key]).filter(Boolean)),
        },
      }),
    }[type];
  };
}

function compareObjects(...objects) {
  const keys = utils.getUniqKeys(objects);
  const [first, ...rest] = objects;
  const makeRecord = router(objects, compareObjects);
  return keys.map((key) => {
    const collection = first;
    const value = utils.findLastValue(key, rest);
    const type = testType({ key, value, collection });
    return makeRecord(type)({ key, value, collection });
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
