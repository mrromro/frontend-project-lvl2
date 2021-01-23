/**
 * Make records from a template
 * @function
 * @param {string} pad - pad to make indentation
 * @param {string} key - a node key
 * @param {string} value - a node value
 * @returns [string] - a record
 */
const template = (pad) => (key, value) => `${pad} ${key}: ${value}`;

/**
 * Contains template to corresponding types of records to make
 * @object
 * @readonly
 * @property {Function} object - to process nested records
 */
const templates = {
  added: template('+'),
  removed: template('-'),
  undefined: template(' '),
  object: (obj, level = 0) => `{\n${obj}\n${'  '.repeat(level)}}`,
};

/**
 * Make records with corresponding indent
 * @function
 * @param {object} node - tree node
 * @param {string} indent - current indent
 * @returns {string} record to display
 */
const record = (node, indent) => {
  const {
    key,
    value,
    type,
    //
    newValue,
  } = node;
  if (type === 'updated') {
    return [
      indent + templates.removed(key, value),
      indent + templates.added(key, newValue),
    ].join('\n');
  }
  return indent + templates[type](key, value);
};

/**
 * Make indent from level and pad to call record()
 * @function
 * @param {object} node - tree node
 * @param {number} level - number of pads
 * @param {string} pad - pad to make indentation
 * @returns {string} record to display with appropriate indent
 */
const makeRecord = (node, level = 0, pad = '  ') => {
  const indent = pad.repeat(level);
  return record(node, indent);
};

/**
 * Traverse a difftree to assemble description of changes
 * @function
 * @exports
 * @param {object} tier - a node or a tier of a tree
 * @param {number} level - current indentation level
 * @returns {string} result to output
 */
const formatter = (tier, level = 0) => {
  if (typeof tier !== 'object' || tier === null) return tier;
  const outcome = tier.map((node) => {
    const { value, newValue } = node;
    const data = {
      ...node,
      value: formatter(value, level + 2),
      newValue: formatter(newValue, level + 2),
    };
    return makeRecord(data, level + 1);
  });
  return templates.object(outcome.join('\n'), level);
};

export default formatter;
