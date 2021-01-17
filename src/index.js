import parser from './parsers/parsers.js';
import diff from './diff.js';
import getFormatter from './formatters/index.js';

const genDiff = async (filename1, filename2, format) => {
  const [obj1, obj2] = await parser.filesToObjects(filename1, filename2);
  const diffTree = diff.compare(obj1, obj2);
  const formatter = await getFormatter(format);
  const outcome = formatter(diffTree);
  return outcome;
};

export default genDiff;
