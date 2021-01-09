function check(conditions) {
  return conditions.every(Boolean);
}

function isAdded({ key, value, collection }) {
  return [!(key in collection), value !== undefined];
}

function isDeleted({ key, value, collection }) {
  return [key in collection, value === undefined];
}

function isUnchanged({ key, value, collection }) {
  return [key in collection, value === collection[key]];
}

function isModified({ key, value, collection }) {
  return [
    typeof collection[key] !== 'object',
    key in collection,
    value !== collection[key],
    value !== undefined,
  ];
}

function isModifiedObject({ key, value, collection }) {
  return [
    typeof collection[key] === 'object',
    key in collection,
    value !== collection[key],
    value !== undefined,
  ];
}

const router = {
  added: {
    name: 'added',
    requirements: isAdded,
  },
  deleted: {
    name: 'deleted',
    requirements: isDeleted,
  },
  unchanged: {
    name: 'unchanged',
    requirements: isUnchanged,
  },
  modified: {
    name: 'modified',
    requirements: isModified,
  },
  modifiedObject: {
    name: 'modifiedObject',
    requirements: isModifiedObject,
  },
};

function isState(testee) {
  return function test(state) {
    return check(state.requirements(testee));
  };
}

export default function testType(testee) {
  const checker = isState(testee);
  return Object.values(router).find(checker).name;
}
