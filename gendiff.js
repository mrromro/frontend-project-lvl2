#!/usr/bin/env node

import { resolve } from 'path';
import { readFileSync } from 'fs';
import program, { output } from './cli.js';
import { getUniqKeys, findLastValue } from './utils.js';

function filesToJSON(...files) {
  return files
    .map((file) => resolve(file))
    .map((filepath) => readFileSync(filepath, 'utf-8'))
    .map((content) => JSON.parse(content));
}

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
  return key in collection && value !== collection[key];
}

const router = {
  added: isAdded,
  deleted: isDeleted,
  unchanged: isUnchanged,
  modified: isModified,
};

function testKey(typeRouter, testee) {
  return Object.keys(typeRouter).find((type) => typeRouter[type](testee));
}

function makePaylosd(type, { key, collection, value }) {
  switch (type) {
    case 'added': return { [key]: value };
    case 'deleted': return { [key]: collection[key] };
    case 'unchanged': return { [key]: collection[key] };
    case 'modified': return { [key]: collection[key], changed: value };
    default:
      throw new Error('unknown happens');
  }
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
    const type = testKey(router, testee);
    const payload = makePaylosd(type, testee);
    return { type, payload };
  });
  return result;
}

program.action((filepath1, filepath2) => {
  const [file1, file2] = filesToJSON(filepath1, filepath2);
  output(compareObjects(file1, file2));
});

program.parse(process.argv);
