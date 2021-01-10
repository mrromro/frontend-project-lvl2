function render(record) {
  if (record instanceof Array) {
    return record.reduce((acc, rec) => ({ ...acc, ...render(rec) }), {});
  }
  const { type, payload } = record;
  const { key, value, newValue } = payload;
  switch (type) {
    case 'added':
      return { [`+ ${key}`]: value };
    case 'deleted':
      return { [`- ${key}`]: value };
    case 'modified':
      return {
        [`- ${key}`]: value,
        [`+ ${key}`]: newValue,
      };
    case 'unchanged':
      return { [`  ${key}`]: value };
    case 'modifiedObject':
      return { [`  ${key}`]: render(value) };
    default: {
      throw new Error(`unexpected type: ${type}`);
    }
  }
}

export default render;
