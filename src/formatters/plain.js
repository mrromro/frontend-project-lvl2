const decorate = (value) => {
  const type = typeof value;
  return (
    {
      string: `'${value}'`,
      object: '[complex object]',
    }[type] ?? value
  );
};

const templates = {
  added: (node, path) => {
    const { key, value } = node;
    return `Property '${path}${key}' was added with value: ${decorate(value)}`;
  },
  removed: ({ key }, path) => `Property '${path}${key}' was removed`,
  updated: (node, path) => {
    const { key, value, newValue } = node;
    return [
      `Property '${path}${key}' was updated.`,
      `From ${decorate(value)} to ${decorate(newValue)}`,
    ].join(' ');
  },
};

const formatter = (tier, path = '') => {
  const outcome = tier.reduce((acc, node) => {
    const { type, key, value } = node;
    if (type === undefined && Array.isArray(value)) {
      return [...acc, formatter(value, `${path}${key}.`)];
    }
    const formatRecord = templates[type];
    if (formatRecord === undefined) return acc;
    return [...acc, formatRecord(node, path)];
  }, []);
  return outcome.filter(Boolean).join('\n');
};

export default formatter;
