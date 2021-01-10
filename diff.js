import utils from './src/utils.js';

const checker = (keyAndObjects) => (fns) => {
  const checkResult = fns.map((fn) => fn(keyAndObjects));
  return checkResult.every(Boolean);
};
const isObejcts = (...objs) => objs.every((obj) => typeof obj === 'object');
const isAdded = ({ key, obj1 }) => obj1[key] === undefined;
const isDeleted = ({ key, obj2 }) => obj2[key] === undefined;
const isUnchanged = ({ key, obj1, obj2 }) => obj1[key] === obj2[key];
const isModified = (keyAndObjects) => {
  const fns = [isAdded, isDeleted, isUnchanged];
  return !checker(keyAndObjects)(fns);
};
const isState = (keyAndObjects) => (state) => {
  const { requirements } = state;
  return checker(keyAndObjects)(requirements);
};

const getState = (router) => (keyAndObjects) => {
  const stateTest = isState(keyAndObjects);
  return Object.values(router).find(stateTest);
};

const makeRecord = (type, { key, value, newValue }) => {
  const payload = { key, value };
  if (newValue) payload.newValue = newValue;
  return { type, payload };
};

const router = {
  added: {
    type: 'added',
    requirements: [isAdded],
    payload: ({ key, obj2 }) => {
      const value = obj2[key];
      return { key, value };
    },
  },
  deleted: {
    type: 'deleted',
    requirements: [isDeleted],
    payload: ({ key, obj1 }) => {
      const value = obj1[key];
      return { key, value };
    },
  },
  unchanged: {
    type: 'unchanged',
    requirements: [isUnchanged],
    payload: ({ key, obj2 }) => {
      const value = obj2[key];
      return { key, value };
    },
  },
  modified: {
    type: 'modified',
    requirements: [isModified],
    payload: ({ key, obj1, obj2 }) => {
      const value = obj1[key];
      const newValue = obj2[key];
      return { key, value, newValue };
    },
  },
};

const testType = (obj1, obj2) => (key) => {
  const keyAndObjects = { key, obj1, obj2 };
  const { type, payload } = getState(router)(keyAndObjects);
  return makeRecord(type, payload(keyAndObjects));
};

const diff = (obj1, obj2) => {
  const keys = utils.getUniqKeys([obj1, obj2]);
  const getType = testType(obj1, obj2);
  return keys.map((key) => {
    if (isObejcts(obj1[key], obj2[key])) {
      return makeRecord('unchanged', { key, value: diff(obj1[key], obj2[key]) });
    }
    return getType(key);
  });
};

export default diff;
