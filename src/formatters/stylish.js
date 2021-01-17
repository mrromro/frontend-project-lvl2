const templates = {
  added: '+',
  deleted: '-',
  undefined: ' ',
  object: (obj, level = 0) => `{\n${obj}\n${'  '.repeat(level)}}`,
};

const makeRecord = (node, level = 0, pad = '  ') => {
  const { key, value, type } = node;
  const indent = pad.repeat(level);
  const record = `${templates[type]} ${key}: ${value}`;
  return indent + record;
};

const formatter = (tier, level = 0) => {
  if (typeof tier !== 'object') return tier;
  const outcome = tier.map((node) => {
    const { key, type, value } = node;
    const data = { key, type, value: formatter(value, level + 2) };
    return makeRecord(data, level + 1);
  });
  return templates.object(outcome.join('\n'), level);
};

export default formatter;
