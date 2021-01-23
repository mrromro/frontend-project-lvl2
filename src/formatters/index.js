import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

/**
 * Router of formatters to import
 * @object
 * @readonly
 * All the properties are binded to functions
 * to let us use this[property]
 * @property {function} default - default route
 * @this refers to the object itself
 */
const router = {
  get default() {
    return this.stylish;
  },
  get stylish() {
    return stylish;
  },
  get plain() {
    return plain;
  },
  get json() {
    return json;
  },
};

/**
 * A module to import chosen formatter
 * @function
 * @param {string} format Name of formatter's alias in router
 * @returns {Function} formatter
 */
export default (format) => router[format] || router.default;
