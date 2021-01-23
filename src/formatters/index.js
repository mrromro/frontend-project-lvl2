import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

/**
 * Router of formatters to import
 * @object
 * @readonly
 * @this refers to the object itself
 */
const router = {
  stylish,
  plain,
  json,
};

/**
 * A module to import chosen formatter
 * @function
 * @param {string} format Name of formatter's alias in router
 * @returns {Function} formatter
 */
export default (format) => router[format] || router.stylish;
