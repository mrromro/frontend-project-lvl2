function getUniqKeys(objects, sort = true) {
  const keys = [
    ...new Set(...objects.map((obj) => Object.keys(obj))),
  ];
  return sort ? keys.sort() : keys;
}

export default getUniqKeys;
