function check(conditions) {
  return conditions.flat().every(Boolean);
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
  return [key in collection, value !== collection[key], value !== undefined];
}

function notIsObject({ key, collection }) {
  return [typeof collection[key] !== 'object'];
}

function isObject({ key, collection }) {
  return [typeof collection[key] === 'object'];
}

const router = {
  added: {
    name: 'added',
    requirements: [isAdded],
  },
  deleted: {
    name: 'deleted',
    requirements: [isDeleted],
  },
  unchanged: {
    name: 'unchanged',
    requirements: [isUnchanged],
  },
  modified: {
    name: 'modified',
    requirements: [isModified, notIsObject],
  },
  modifiedObject: {
    name: 'modifiedObject',
    requirements: [isModified, isObject],
  },
};

function isState(testee) {
  return function test(state) {
    return check(state.requirements.map((req) => req(testee)));
  };
}

export default function testType(testee) {
  const checker = isState(testee);
  return Object.values(router).find(checker).name;
}
