const createNode = ({ key = null, type = 'unchanged', value = null } = {}) => ({
  key,
  type,
  value,
});

const isObject = (obj) => typeof obj === 'object' && obj !== null;

const getTreeKeys = (tree) => tree.map(({ key }) => key);
const getTreesKeys = (...trees) => {
  const allKeys = trees.map(getTreeKeys).flat().sort();
  const uniqKeys = [...new Set(allKeys)];
  return uniqKeys;
};
const keysDifference = (all, sub) => all.filter((key) => !sub.includes(key));
const isIncluded = (list) => (key) => list.includes(key);

const getNode = (tier, keyToFind) => tier.find(({ key }) => key === keyToFind);
const getNodeCopy = (keyToFind) => (slice) => (type) => {
  const node = getNode(slice, keyToFind);
  const { key, value } = node;
  return createNode({ key, type, value });
};

const makeTree = (obj) => {
  if (!isObject(obj)) return obj;
  const entries = Object.entries(obj).sort();
  const children = entries.map(([key, valueToProcess]) => {
    const value = makeTree(valueToProcess);
    return createNode({ key, value });
  });
  return children;
};

const compareTrees = (oldTree, newTree) => {
  const oldKeys = getTreeKeys(oldTree);
  const newKeys = getTreeKeys(newTree);
  const allKeys = getTreesKeys(oldTree, newTree);
  const isAdded = isIncluded(keysDifference(allKeys, oldKeys));
  const isDeleted = isIncluded(keysDifference(allKeys, newKeys));

  const tier = allKeys.reduce((tree, key) => {
    const getCopy = getNodeCopy(key);
    if (isAdded(key)) return [...tree, getCopy(newTree)('added')];
    if (isDeleted(key)) return [...tree, getCopy(oldTree)('deleted')];
    const oldNode = getNode(oldTree, key);
    const newNode = getNode(newTree, key);
    if (oldNode.value === newNode.value) return [...tree, oldNode];
    if (isObject(newNode.value) && isObject(oldNode.value)) {
      const value = compareTrees(oldNode.value, newNode.value);
      return [...tree, createNode({ key, value })];
    }
    return [...tree, getCopy(oldTree)('deleted'), getCopy(newTree)('added')];
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
