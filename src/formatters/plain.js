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

const isNested = (node) => {
  const { type, value } = node;
  return type === undefined && Array.isArray(value);
};

const isToPass = ({ type }) => {
  const formatRecord = templates[type];
  return formatRecord === undefined;
};

const formatter = (tier, path = '') => {
  const outcome = tier.reduce((acc, node) => {
    const { type, key, value } = node;
    if (isNested(node)) {
      const record = formatter(value, `${path}${key}.`);
      return record ? [...acc, record] : acc;
    }
    if (isToPass(node)) return acc;
    return [...acc, templates[type](node, path)];
  }, []);
  return outcome.join('\n');
};

export default formatter;
