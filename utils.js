function getUniqKeys(objects, sort = true) {
  const keys = [
    ...new Set(...objects.map((obj) => Object.keys(obj))),
  ];
  return sort ? keys.sort() : keys;
}

function findLastValue(key, collection) {
  const coll = collection.slice().reverse();
  const obj = coll.find((item) => key in item);
  return key in obj ? obj[key] : undefined;
}

export {
  getUniqKeys,
  findLastValue,
};
