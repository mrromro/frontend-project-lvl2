#!/usr/bin/env node

import { resolve } from 'path';
import { readFileSync } from 'fs';
import program from './cli.js';

function filesToJSON(...files) {
  return files
    .map((file) => resolve(file))
    .map((filepath) => readFileSync(filepath, 'utf-8'))
    .map((content) => JSON.parse(content));
}

function compareJSON() {}

program.action((filepath1, filepath2) => {
  const [file1, file2] = filesToJSON(filepath1, filepath2);
  compareJSON(file1, file2);
});

program.parse(process.argv);
