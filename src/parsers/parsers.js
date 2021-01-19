import path from 'path';
import yaml from 'js-yaml';
import { promises as p } from 'fs';

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
    default:
      throw new Error(`unknown file extension ${extension}`);
  }
}

/**
 * Converts one file to {Object}
 * @function
 * @async
 * @param {string} file - name of file
 * @returns {Promise} with {Object} to be got from file
 */
async function fileToObject(file) {
  const addr = path.resolve(file);
  const data = await p.readFile(addr, 'utf-8');
  return chooseLoader(file)(data);
}

/**
 * Converts files to {Object}s
 * @function
 * @async
 * @exports named
 * @param  {...string} files - names of files
 * @returns {Promise} with {Array[]} to be got from files
 */
async function filesToObjects(...files) {
  return Promise.all(files.map(fileToObject));
}

export default {
  chooseLoader,
  fileToObject,
  filesToObjects,
};
