import path from 'path';
import yaml from 'js-yaml';
import { readFileSync } from 'fs';

function chooseLoader(filename) {
  const extension = path.extname(filename).toLowerCase();
  switch (extension) {
    case '.json': return JSON.parse;
    case '.yaml': return yaml.load;
    default: throw new Error(`unknown file extension ${extension}`);
  }
}

function fileToObject(file) {
  const addr = path.resolve(file);
  const data = readFileSync(addr, 'utf-8');
  return chooseLoader(file)(data);
}

function filesToObjects(...files) {
  return files.map(fileToObject);
}

export default { filesToObjects };
