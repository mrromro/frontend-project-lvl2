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

function compareObjects(...objects) {
  const indent = '  ';
  const keys = getUniqKeys(objects);
  const [first, ...rest] = objects;
  const result = keys.reduce((res, key) => {
    const value = findLastValue(key, rest);
    if (!(key in first)) return [...res, `+ ${key}: ${value}`];
    if (value === undefined) return [...res, `- ${key}: ${value}`];
    if (first[key] === value) return [...res, `  ${key}: ${value}`];
    return [...res, `- ${key}: ${first[key]}`, `+ ${key}: ${value}`];
  }, []);
  return ['{\n', result.join(`\n${indent}`), '\n}'].join(indent);
}

program.action((filepath1, filepath2) => {
  const [file1, file2] = filesToJSON(filepath1, filepath2);
  output(compareObjects(file1, file2));
});

program.parse(process.argv);
