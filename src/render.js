/* eslint-disable no-use-before-define */
function mapToObj(records) {
  const result = records.reduce(
    (acc, record) => ({ ...acc, ...reducer(record) }),
    {},
  );
  return result;
}

function reducer(record) {
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
      const { key, value } = record;
      return { [key]: mapToObj(value) };
    }
  }
}

export default { mapToObj };
