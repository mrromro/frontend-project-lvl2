function render(record) {
  const { type, payload } = record;
  if (payload === undefined) {
    return record.reduce((acc, rec) => ({ ...acc, ...render(rec) }), {});
  }
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
    default: {
      throw new Error(`unexpected type: ${type}`);
    }
  }
}

export default render;
