#!/usr/bin/env node
import { program } from 'commander';
import gendiff from '../index.js';

/** Confuguration */
program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action(async (filepath1, filepath2) => {
    /** The only function called to process all the data */
    // eslint-disable-next-line no-console
    console.log(await gendiff(filepath1, filepath2, program.format));
    process.exit(0);
  });

program.parse(process.argv);
