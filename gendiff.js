#!/usr/bin/env node

import program, { output } from './src/cli.js';
import utils from './src/utils.js';
import loader from './src/loaders.js';
import parser from './src/Parser.js';

function compareObjects(...objects) {
  const keys = utils.getUniqKeys(objects);
  const [first, ...rest] = objects;
  return keys.map((key) => {
    const testee = {
      key,
      collection: first,
      value: utils.findLastValue(key, rest),
    };
    return parser.process(testee);
  });
}

program.action((filepath1, filepath2) => {
  const [file1, file2] = loader.filesToObjects(filepath1, filepath2);
  output(compareObjects(file1, file2));
});

program.parse(process.argv);
