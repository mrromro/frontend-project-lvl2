#!/usr/bin/env node
/* eslint-disable no-use-before-define */
import program, { output } from './src/cli.js';
import utils from './src/utils.js';
import loader from './src/loaders.js';
import render from './src/render.js';

function isAdded({ key, collection, value }) {
  return !(key in collection) && value !== undefined;
}

function isDeleted({ key, collection, value }) {
  return key in collection && value === undefined;
}

function isUnchanged({ key, collection, value }) {
  return key in collection && value === collection[key];
}

function isModified({ key, collection, value }) {
  return key in collection && value !== collection[key] && value !== undefined;
}

const router = {
  added: isAdded,
  deleted: isDeleted,
  unchanged: isUnchanged,
  modified: isModified,
};

function compareObjects(...objects) {
  const keys = utils.getUniqKeys(objects);
  const [first, ...rest] = objects;
  return keys.map((key) => {
    const collection = first;
    const value = utils.findLastValue(key, rest);
    const testee = {
      key,
      collection,
      value,
    };
    let type = Object.keys(router).find((op) => router[op](testee));
    let payload;
    switch (type) {
      case 'added': {
        payload = { key, value };
        break;
      }
      case 'deleted': {
        payload = { key, value: collection[key] };
        break;
      }
      case 'unchanged': {
        payload = { key, value: collection[key] };
        break;
      }
      case 'modified': {
        if (typeof collection[key] === 'object') {
          type = 'unchanged';
          payload = {
            key,
            value: compareObjects(
              ...objects.map((obj) => obj[key]).filter(Boolean),
            ),
          };
        } else {
          payload = { key, value: collection[key], newValue: value };
        }
        break;
      }
      default:
        throw new Error('unknown happens');
    }
    return { type, payload };
  });
}

program.action((filepath1, filepath2) => {
  const [file1, file2] = loader.filesToObjects(filepath1, filepath2);
  const compareResult = compareObjects(file1, file2);
  // output(compareResult);
  const result = render.mapToObj(compareResult);
  output(result);
});

program.parse(process.argv);

export default compareObjects;
