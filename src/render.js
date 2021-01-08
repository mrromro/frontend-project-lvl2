function render(record) {
  const { type, payload } = record;
  switch (type) {
    case 'added': {
      const { key, value } = payload;
      return { [`+ ${key}`]: value };
    }
    case 'deleted': {
      const { key, value } = payload;
      return { [`- ${key}`]: value };
    }
    case 'modified': {
      const { key, value, newValue } = payload;
      return {
        [`- ${key}`]: value,
        [`+ ${key}`]: newValue,
      };
    }
    case 'unchanged': {
      const { key, value } = payload;
      return { [`  ${key}`]: value };
    }
    default: {
      return record.reduce((acc, rec) => ({ ...acc, ...render(rec) }), {});
    }
  }
}

export default render;
