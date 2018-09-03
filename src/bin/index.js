#!/usr/bin/env node
import commander from 'commander';
import { version } from '../../package.json';
import { fileCreate } from '../utils/utils';

commander
  .version(version, '-V, --version')
  .arguments('<url>')
  .usage('[options] <Directory> <URL>')
  .option('-o, --output [path]', 'output path')
  .action((url) => {
    fileCreate(url, commander.output);
  })
  .parse(process.argv);

