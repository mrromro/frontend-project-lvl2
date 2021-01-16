const createNode = ({ key = null, type = 'unchanged', value = null } = {}) => ({
  key,
  type,
  value,
});

const isObjects = (...objs) => {
  const check = objs.map((obj) => typeof obj === 'object' && obj !== null);
  return check.every(Boolean);
};

const getTreeKeys = (tree) => tree.map(({ key }) => key);
const getTreesKeys = (...trees) => {
  const allKeys = trees.map(getTreeKeys).flat().sort();
  const uniqKeys = [...new Set(allKeys)];
  return uniqKeys;
};

const getNode = (tier, keyToFind) => tier.find(({ key }) => key === keyToFind);
const copyNode = (node, options) => ({ ...node, ...options });

const makeTree = (obj) => {
  if (!isObjects(obj)) return obj;
  const entries = Object.entries(obj).sort();
  const children = entries.map(([key, valueToProcess]) => {
    const value = makeTree(valueToProcess);
    return createNode({ key, value });
  });
  return children;
};

const added = ({ oldNode }) => oldNode === undefined;
const deleted = ({ newNode }) => newNode === undefined;
const equal = (nodes) => {
  const {
    oldNode: { value: oldValue },
    newNode: { value: newValue },
  } = nodes;
  return oldValue === newValue;
};
const nested = (nodes) => {
  const {
    oldNode: { value: oldValue },
    newNode: { value: newValue },
  } = nodes;
  return isObjects(oldValue, newValue);
};

const rule = (callback) => (conditions) => (nodes) => {
  const result = conditions
    .map((condition) => condition(nodes))
    .every(callback);
  return result;
};
const all = rule(Boolean);
const not = rule((arg) => !arg);

const check = ([fn, conditions]) => fn(conditions);

const types = {
  added: {
    name: 'added',
    requirements: [all, [added]],
  },
  deleted: {
    name: 'deleted',
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
  modified: {
    name: 'modified',
    requirements: [not, [added, deleted, equal, nested]],
  },
};

const typeNode = (nodes, router = types) => {
  const allTypes = Object.values(router);
  const type = allTypes.find(({ requirements }) => check(requirements)(nodes));
  return { type: type.name, ...nodes };
};

const classify = (oldTree, newTree) => (key) => {
  const nodes = {
    oldNode: getNode(oldTree, key),
    newNode: getNode(newTree, key),
  };
  return typeNode(nodes);
};

const makeState = (typedNode, callback) => {
  const { type, oldNode, newNode } = typedNode;
  const payloads = {
    added: () => [copyNode(newNode, { type })],
    deleted: () => [copyNode(oldNode, { type })],
    equal: () => [copyNode(oldNode, { type: 'unchanged' })],
    modified: () => [
      copyNode(oldNode, { type: 'deleted' }),
      copyNode(newNode, { type: 'added' }),
    ],
    nested: () => [
      copyNode(oldNode, {
        value: callback(oldNode.value, newNode.value),
      }),
    ],
  };
  return payloads[type]();
};

const compareTrees = (oldTree, newTree) => {
  const findType = classify(oldTree, newTree);

  const tier = getTreesKeys(oldTree, newTree).reduce((tree, key) => {
    const typedNode = findType(key);
    return [...tree, ...makeState(typedNode, compareTrees)];
  }, []);

  return tier;
};

const compare = (oldData, newData) => {
  const [oldTree, newTree] = [makeTree(oldData), makeTree(newData)];
  return compareTrees(oldTree, newTree);
};

export default {
  compare,
  compareTrees,
  makeTree,
};
