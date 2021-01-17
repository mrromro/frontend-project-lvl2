const router = {
  get default() { return this.stylish; },
  get stylish() { return './stylish.js'; },
  get plain() { return './plain.js'; },
};

export default async (format) => {
  const path = router[format] || router.default;
  const { default: formatter } = await import(path);
  return formatter;
};
