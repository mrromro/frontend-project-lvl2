#!/usr/bin/env node

import { resolve } from 'path';
import { readFileSync } from 'fs';
import program, { output } from './cli.js';
import { getUniqKeys, findLastValue } from './utils.js';
import router from './Router.js';

function filesToJSON(...files) {
  return files
    .map((file) => resolve(file))
    .map((filepath) => readFileSync(filepath, 'utf-8'))
    .map((content) => JSON.parse(content));
}

function compareObjects(...objects) {
  const keys = getUniqKeys(objects);
  const [first, ...rest] = objects;
  const result = keys.map((key) => {
    const testee = {
      key,
      collection: first,
      value: findLastValue(key, rest),
    };
    return router.process(testee);
  });
  return result;
}

program.action((filepath1, filepath2) => {
  const [file1, file2] = filesToJSON(filepath1, filepath2);
  output(compareObjects(file1, file2));
});

program.parse(process.argv);
