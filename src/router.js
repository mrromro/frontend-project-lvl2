function check(conditions) {
  return conditions.every(Boolean);
}

function isAdded({ key, collection, value }) {
  return [
    !(key in collection),
    value !== undefined,
  ];
}

function isDeleted({ key, collection, value }) {
  return [
    key in collection,
    value === undefined,
  ];
}

function isUnchanged({ key, collection, value }) {
  return [
    key in collection,
    value === collection[key],
  ];
}

function isModified({ key, collection, value }) {
  return [
    typeof collection[key] !== 'object',
    key in collection,
    value !== collection[key],
    value !== undefined,
  ];
}

function isModifiedObject({ key, collection, value }) {
  return [
    typeof collection[key] === 'object',
    key in collection,
    value !== collection[key],
    value !== undefined,
  ];
}

// const mark = {
//   added: '+',
//   deleted: '-',
//   empty: ' ',
// };

// function toString(pad, key, value) {
//   return `${pad} ${key}: ${value}`;
// }

const router = {
  added: isAdded,
  deleted: isDeleted,
  unchanged: isUnchanged,
  modified: isModified,
  modifiedObject: isModifiedObject,
};

export default function testType(testee) {
  return Object.keys(router).find((op) => check(router[op](testee)));
}
