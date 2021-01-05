import { program } from 'commander';

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.1.0', '-V, --version', 'output the current version');

program
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format');

export function output(data) {
  // eslint-disable-next-line no-console
  console.log(data);
}

export default program;
