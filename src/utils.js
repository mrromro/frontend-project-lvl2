function getUniqKeys(objects, sort = true) {
  const keys = [...new Set(objects.map(Object.keys).flat())];
  return sort ? keys.sort() : keys;
}

function findLastValue(key, collection) {
  const coll = collection.slice().reverse();
  const obj = coll.find((item) => key in item);
  return obj ? obj[key] : undefined;
}

export default {
  getUniqKeys,
  findLastValue,
};
