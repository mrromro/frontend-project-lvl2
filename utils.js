import { resolve } from 'path';
import { readFileSync } from 'fs';

function getUniqKeys(objects, sort = true) {
  const keys = [...new Set(...objects.map((obj) => Object.keys(obj)))];
  return sort ? keys.sort() : keys;
}

function findLastValue(key, collection) {
  const coll = collection.slice().reverse();
  const obj = coll.find((item) => key in item);
  return obj ? obj[key] : undefined;
}

function JSONfilesToObjects(...files) {
  return files
    .map((file) => resolve(file))
    .map((filepath) => readFileSync(filepath, 'utf-8'))
    .map((content) => JSON.parse(content));
}

export default {
  getUniqKeys,
  findLastValue,
  JSONfilesToObjects,
};
