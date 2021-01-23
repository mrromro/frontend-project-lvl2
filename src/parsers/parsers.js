import path from 'path';
import yaml from 'js-yaml';
import { readFileSync } from 'fs';

/**
 * Choose file parser according to file extension
 * @function
 * @param {string} filename - name of file to load
 * @returns {Function} appropriate loader
 */
function chooseLoader(filename) {
  const extension = path.extname(filename).toLowerCase();
  switch (extension) {
    case '.json':
      return JSON.parse;
    case '.yaml':
      return yaml.load;
    case '.yml':
      return yaml.load;
    default:
      throw new Error(`unknown file extension ${extension}`);
  }
}

/**
 * Converts one file to {Object}
 * @function
 * @param {string} file - name of file
 * @returns {Function} with {Object} got from file
 */
function fileToObject(file) {
  const addr = path.resolve(file);
  const data = readFileSync(addr, 'utf-8');
  return chooseLoader(file)(data);
}

/**
 * Converts files to {Object}s
 * @function
 * @exports named
 * @param  {...string} files - names of files
 * @returns {Array[]} got from files
 */
function filesToObjects(...files) {
  return files.map(fileToObject);
}

export default {
  chooseLoader,
  fileToObject,
  filesToObjects,
};
