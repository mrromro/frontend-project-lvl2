#!/usr/bin/env node
import commander from 'commander';
import gendiff from '../index.js';

const { program } = commander;
/**
 * Confuguration of CLI
 * An entry point is into the action method call.
 * @see https://github.com/tj/commander.js
 * */
program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    // eslint-disable-next-line no-console
    console.log(gendiff(filepath1, filepath2, program.format));
    process.exit(0);
  });

program.parse(process.argv);
