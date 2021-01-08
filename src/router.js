function isAdded({ key, collection, value }) {
  return !(key in collection) && value !== undefined;
}

function isDeleted({ key, collection, value }) {
  return key in collection && value === undefined;
}

function isUnchanged({ key, collection, value }) {
  return key in collection && value === collection[key];
}

function isModified({ key, collection, value }) {
  return key in collection && value !== collection[key] && value !== undefined;
}

const router = {
  added: isAdded,
  deleted: isDeleted,
  unchanged: isUnchanged,
  modified: isModified,
};

export default function testType(testee) {
  return Object.keys(router).find((op) => router[op](testee));
}
