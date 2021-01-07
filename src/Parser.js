class Parser {
  constructor(router) {
    this.router = router;
  }

  testKey(testee) {
    return Object.keys(this.router).find((type) => this.router[type](testee));
  }

  static makePaylosd(type, { key, collection, value }) {
    switch (type) {
      case 'added':
        return { [key]: value };
      case 'deleted':
        return { [key]: collection[key] };
      case 'unchanged':
        return { [key]: collection[key] };
      case 'modified':
        return { [key]: collection[key], changed: value };
      default:
        throw new Error('unknown happens');
    }
  }

  process(testee) {
    const type = this.testKey(testee);
    const payload = this.constructor.makePaylosd(type, testee);
    return { type, payload };
  }
}

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

export default new Parser(router);
