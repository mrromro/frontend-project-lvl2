const template = (pad) => (key, value) => `${pad} ${key}: ${value}`;

const templates = {
  added: template('+'),
  removed: template('-'),
  undefined: template(' '),
  object: (obj, level = 0) => `{\n${obj}\n${'  '.repeat(level)}}`,
};

const record = (node, indent) => {
  const {
    key,
    value,
    type,
    //
    newValue,
  } = node;
  if (type === 'updated') {
    return [
      indent + templates.removed(key, value),
      indent + templates.added(key, newValue),
    ].join('\n');
  }
  return indent + templates[type](key, value);
};

const makeRecord = (node, level = 0, pad = '  ') => {
  const indent = pad.repeat(level);
  return record(node, indent);
};

const formatter = (tier, level = 0) => {
  if (typeof tier !== 'object') return tier;
  const outcome = tier.map((node) => {
    const { value } = node;
    const data = { ...node, value: formatter(value, level + 2) };
    return makeRecord(data, level + 1);
  });
  return templates.object(outcome.join('\n'), level);
};

export default formatter;
