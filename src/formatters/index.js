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
    return './stylish.js';
  },
  get plain() {
    return './plain.js';
  },
  get json() {
    return './json.js';
  },
};

/**
 * A module to import chosen formatter
 * @function
 * @async
 * @param {string} format Name of formatter's alias in router
 * @returns {Promise} with formatter
 */
export default async (format) => {
  const path = router[format] || router.default;
  const { default: formatter } = await import(path);
  return formatter;
};
