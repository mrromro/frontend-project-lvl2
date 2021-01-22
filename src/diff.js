/**
 * Creates an object by making shallow copy
 * @param {Object} options - object to be copied
 * @returns {Object} - shallow copy
 */
const createNode = (options = {}) => ({ ...options });

/**
 * Tests if items are type of Object
 * @param  {...any} objs - items to test
 * @returns {Boolean}
 */
const isObjects = (...objs) => {
  const check = objs.map((obj) => typeof obj === 'object' && obj !== null);
  return check.every(Boolean);
};

/**
 * Extracts keys from objects in one tier of a tree
 * @param {Object[]} tree
 * @returns {string[]} keys
 */
const getTreeKeys = (tree) => tree.map(({ key }) => key);

/**
 * Extracts keys from objects in one tier of several trees
 * @param  {...Object[]} trees
 * @returns {string[]} sorted unique keys
 */
const getTreesKeys = (...trees) => {
  const allKeys = trees.map(getTreeKeys).flat().sort();
  const uniqKeys = [...new Set(allKeys)];
  return uniqKeys;
};

/**
 * Search for a node with a given key
 * @param {Object[]} tier - tree tier
 * @param {*} keyToFind - name of the key to find
 * @returns {Object | undefined} node
 */
const getNode = (tier, keyToFind) => tier.find(({ key }) => key === keyToFind);

/**
 * Takes an object with nodes havin equal keys to test if it is
 * 'added' case
 * @param {Object} param0 - reference to oldNode
 * @returns {Boolean} if 'added' case
 */
const added = ({ oldNode }) => oldNode === undefined;

/**
 * Takes an object with nodes havin equal keys to test if it is
 * 'added' case
 * @param {Object} param0 - reference to oldNode
 * @returns {Boolean} if 'added' case
 */
const deleted = ({ newNode }) => newNode === undefined;

/**
 * Takes an object with nodes havin equal keys to test if it is
 * 'equal' case
 * @param {Object} nodes - reference to nodes
 * @returns {Boolean} if 'deleted' case
 */
const equal = (nodes) => {
  const {
    oldNode: { value: oldValue },
    newNode: { value: newValue },
  } = nodes;
  return oldValue === newValue;
};

/**
 * Takes an object with nodes havin equal keys to test if it is
 * 'nested' case
 * @param {Object} nodes - reference to nodes
 * @returns {Boolean} if 'nested' case
 */
const nested = (nodes) => {
  const {
    oldNode: { value: oldValue },
    newNode: { value: newValue },
  } = nodes;
  return isObjects(oldValue, newValue);
};

/**
 * Construct rule to test values
 * @param {Function} callback - applies a rule
 * to result of testing with conditions values
 * @param {Function[]} conditions - list of predicates to test values
 * @param {Object} nodes - values to test
 * @returns {Function | Boolean} implementation of rule or test result
 */
const rule = (callback) => (conditions) => (nodes) => {
  const result = conditions
    .map((condition) => condition(nodes))
    .every(callback);
  return result;
};

/**
 * Implemetation of rule to test if all conditions are met
 */
const all = rule(Boolean);
/**
 * Implementation of rule to test if no conditions are met
 */
const not = rule((arg) => !arg);

/**
 * Applies [type][requirement] to node
 * @param {Array} param0 - requirements property
 * @returns {Function} checking nodes
 */
const check = ([fn, conditions]) => fn(conditions);

/**
 * Contains types and its requirements to meet
 * @object
 * @readonly
 */
const types = {
  added: {
    name: 'added',
    requirements: [all, [added]],
  },
  removed: {
    name: 'removed',
    requirements: [all, [deleted]],
  },
  equal: {
    name: 'equal',
    requirements: [all, [equal]],
  },
  nested: {
    name: 'nested',
    requirements: [all, [nested]],
  },
  updated: {
    name: 'updated',
    requirements: [not, [added, deleted, equal, nested]],
  },
};

/**
 * Tests nodes for finding its case
 * @param {Object[]} nodes - nodes to find appropriate case
 * @param {object} router - object contains requirements for types
 * @returns {Object} with type and nodes fields
 */
const typeNode = (nodes, router = types) => {
  const allTypes = Object.values(router);
  const type = allTypes.find(({ requirements }) => check(requirements)(nodes));
  return { type: type.name, ...nodes };
};

/**
 * Take trees to make a testing function.
 * Returned function takes key, finds appropriate nodes and get typed node.
 * @param {Object} oldTree - treed object with old data
 * @param {Object} newTree - treed object with new data
 * @returns {Function} converts key to typed node.
 */
const classify = (oldTree, newTree) => (key) => {
  const nodes = {
    oldNode: getNode(oldTree, key),
    newNode: getNode(newTree, key),
  };
  return typeNode(nodes);
};

/**
 * Makes a node of difftree from typed node
 * @param {Object} typedNode - typed node
 * @param {Function} callback - callback for processing nested nodes
 * @returns {Object} difftree node
 */
const makeState = (typedNode, callback) => {
  const { type, oldNode, newNode } = typedNode;
  const payloads = {
    added: () => createNode({ ...newNode, type }),
    removed: () => createNode({ ...oldNode, type }),
    equal: () => createNode(oldNode),
    updated: () => createNode({ ...oldNode, newValue: newNode.value, type }),
    nested: () => {
      const value = callback(oldNode.value, newNode.value);
      return createNode({ ...oldNode, value });
    },
  };
  return payloads[type]();
};

/**
 * Make a tree from object
 * @param {Object} obj - JS-object
 * @returns {Object[]} tree
 */
const makeTree = (obj) => {
  if (!isObjects(obj)) return obj;
  const entries = Object.entries(obj);
  const children = entries.map(([key, valueToProcess]) => {
    const value = makeTree(valueToProcess);
    return createNode({ key, value });
  });
  return children;
};

/**
 * Compares trees tier-by-tier recursively
 * @param {Object[]} oldTree - treed old data
 * @param {Object[]} newTree - treed new data
 * @returns {Object[]} - difftree tier
 */
const compareTrees = (oldTree, newTree) => {
  const findType = classify(oldTree, newTree);

  const tier = getTreesKeys(oldTree, newTree).reduce((tree, key) => {
    const typedNode = findType(key);
    return [...tree, makeState(typedNode, compareTrees)];
  }, []);

  return tier;
};

/**
 * Compares objects
 * @exports named
 * @param {Object} oldData - JS-object
 * @param {Object} newData - JS-object
 * @returns difftree
 */
const compare = (oldData, newData) => {
  const [oldTree, newTree] = [makeTree(oldData), makeTree(newData)];
  return compareTrees(oldTree, newTree);
};

export default {
  compare,
  compareTrees,
  makeTree,
};
