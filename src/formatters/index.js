const router = {
  stylish: './stylish.js',
};

export default async (format) => {
  const { default: formatter } = await import(router[format]);
  return formatter;
};
