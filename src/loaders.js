import { resolve } from 'path';
import { readFileSync } from 'fs';

function JSONfilesToObjects(...files) {
  return files
    .map((file) => resolve(file))
    .map((filepath) => readFileSync(filepath, 'utf-8'))
    .map((content) => JSON.parse(content));
}

export default { JSONfilesToObjects };
