import parser from './parsers/parsers.js';
import diff from './diff.js';
import getFormatter from './formatters/index.js';

/**
 * An entry point to process data and get formatted diff.
 * @param {string} filename1 - name of file with old data
 * @param {string} filename2 - name of file with new data
 * @param {string} format - name of formatter to format difftree
 */
const genDiff = (filename1, filename2, format) => {
  const [obj1, obj2] = parser.filesToObjects(filename1, filename2);
  const diffTree = diff.compare(obj1, obj2);
  const formatter = getFormatter(format);
  const outcome = formatter(diffTree);
  return outcome;
};

export default genDiff;
