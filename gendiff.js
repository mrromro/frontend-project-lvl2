#!/usr/bin/env node

import program, { output } from './cli.js';
import utils from './utils.js';
import router from './Router.js';

function compareObjects(...objects) {
  const keys = utils.getUniqKeys(objects);
  const [first, ...rest] = objects;
  return keys.map((key) => {
    const testee = {
      key,
      collection: first,
      value: utils.findLastValue(key, rest),
    };
    return router.process(testee);
  });
}

program.action((filepath1, filepath2) => {
  const [file1, file2] = utils.JSONfilesToObjects(filepath1, filepath2);
  output(compareObjects(file1, file2));
});

program.parse(process.argv);
