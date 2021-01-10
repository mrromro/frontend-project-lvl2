import parser from './src/parsers.js';
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

const makeRecord = (type) => ({ key, value, newValue }) => {
  const payload = { key, value };
  if (newValue) payload.newValue = newValue;
  return { type, payload };
};

const router = {
  added: {
    name: 'added',
    requirements: [isAdded],
    get message() {
      const template = makeRecord(this.name);
      return function record({ key, obj2 }) {
        const value = obj2[key];
        return template({ key, value });
      };
    },
  },
  deleted: {
    name: 'deleted',
    requirements: [isDeleted],
    get message() {
      const template = makeRecord(this.name);
      return function record({ key, obj1 }) {
        const value = obj1[key];
        return template({ key, value });
      };
    },
  },
  unchanged: {
    name: 'unchanged',
    requirements: [isUnchanged],
    get message() {
      const template = makeRecord(this.name);
      return function record({ key, obj2 }) {
        const value = obj2[key];
        return template({ key, value });
      };
    },
  },
  modified: {
    name: 'modified',
    requirements: [isModified],
    get message() {
      const template = makeRecord(this.name);
      return function record({ key, obj1, obj2 }) {
        const value = obj1[key];
        const newValue = obj2[key];
        return template({ key, value, newValue });
      };
    },
  },
};

const testType = (obj1, obj2) => (key) => {
  const keyAndObjects = { key, obj1, obj2 };
  const state = getState(router)(keyAndObjects);
  return state.message(keyAndObjects);
};

const diff = (obj1, obj2) => {
  const keys = utils.getUniqKeys([obj1, obj2]);
  const getType = testType(obj1, obj2);
  return keys.map((key) => {
    if (isObejcts(obj1[key], obj2[key])) {
      return makeRecord('unchanged')({ key, value: diff(obj1[key], obj2[key]) });
    }
    return getType(key);
  });
};

const deep1 = parser.fileToObject('./__tests__/__fixtures__/deep1.json');
const deep2 = parser.fileToObject('./__tests__/__fixtures__/deep2.json');
// diff(deep1, deep2);
console.log(JSON.stringify(diff(deep1, deep2), null, 2));
