/**
 * Returns built-in formatter
 * @function
 * @param {Object[]} difftree
 * @returns configured formatter
 */
export default (tree) => JSON.stringify(tree, null, 2);
