/**
 * Router of formatters to import
 * @object
 * @readonly
 * All the properties are binded to functions
 * to let us be able use this[property]
 * @property {function} default - default route
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
