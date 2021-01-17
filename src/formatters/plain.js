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
  undefined: () => {},
};

const isNested = (node) => {
  const { type, value } = node;
  return type === undefined && Array.isArray(value);
};

const formatter = (tier, path = '') => {
  const { key, value, type } = tier;
  if (isNested(tier)) {
    return formatter(value, `${path}${key}.`);
  }
  if (!Array.isArray(tier)) {
    return templates[type](tier, path);
  }
  const outcome = tier.reduce(
    (acc, node) => [...acc, formatter(node, `${path}`)],
    [],
  );
  return outcome.filter(Boolean).join('\n');
};

export default formatter;
