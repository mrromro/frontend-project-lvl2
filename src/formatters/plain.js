/**
 * Decorates value following its type
 * @function
 * @param {*} value Any value of tree node to print
 * @returns {string} decorated value or value itself
 * in case of unsupported type
 */
const decorate = (value) => {
  const type = typeof value;
  return (
    {
      string: `'${value}'`,
      object: '[complex object]',
    }[type] ?? value
  );
};

/**
 * @object
 * @readonly
 * @property {Function} - function to construct line from a template
 * @property {Function} undefined - fallback for case of attempt of
 * getting function with a key not existed
 */
const templates = {
  added: (node, path) => {
    const { key, value } = node;
    return `Property '${path}${key}' was added with value: ${decorate(value)}`;
  },
  removed: ({ key }, path) => `Property '${path}${key}' was removed`,
  updated: (node, path) => {
    const { key, value, newValue } = node;
    return [
      `Property '${path}${key}' was updated.`,
      `From ${decorate(value)} to ${decorate(newValue)}`,
    ].join(' ');
  },
  undefined: () => {},
};

/**
 * A predicate to test if node is not terminal
 * @function
 * @param {object} node - tree node
 */
const isNested = (node) => {
  const { type, value } = node;
  return type === undefined && Array.isArray(value);
};

/**
 * Traverse a difftree to assemble description of changes
 * @function
 * @exports
 * @param {*} tier - a node or a tier of a tree
 * @param {*} path - assemble full path to node to process
 * @returns {string} result to output
 */
const formatter = (tier, path = '') => {
  const { key, value, type } = tier;
  if (isNested(tier)) {
    return formatter(value, `${path}${key}.`);
  }
  if (!Array.isArray(tier)) {
    return templates[type](tier, path);
  }
  const outcome = tier.reduce(
    (acc, node) => [...acc, formatter(node, `${path}`)],
    [],
  );
  return outcome.filter(Boolean).join('\n');
};

export default formatter;
