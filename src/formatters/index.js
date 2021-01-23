import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

/**
 * Router of imported formatters
 * @object
 * @readonly
 * @param {Function} default to fail-safety
 */
const router = {
  stylish,
  plain,
  json,
  default: stylish,
};

/**
 * Import chosen or default formatter
 * @function
 * @param {string} format name of formatter's alias in router
 * @returns {Function} formatter
 */
export default (format) => router[format] || router.default;
