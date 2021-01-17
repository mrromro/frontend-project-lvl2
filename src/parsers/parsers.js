import path from 'path';
import yaml from 'js-yaml';
import { promises as p } from 'fs';

function chooseLoader(filename) {
  const extension = path.extname(filename).toLowerCase();
  switch (extension) {
    case '.json':
      return JSON.parse;
    case '.yaml':
      return yaml.load;
    default:
      throw new Error(`unknown file extension ${extension}`);
  }
}

async function fileToObject(file) {
  const addr = path.resolve(file);
  const data = await p.readFile(addr, 'utf-8');
  return chooseLoader(file)(data);
}

async function filesToObjects(...files) {
  return Promise.all(files.map(fileToObject));
}

export default {
  chooseLoader,
  fileToObject,
  filesToObjects,
};
