#!/usr/bin/env node
import commander from 'commander';
import { version } from '../../package.json';
import saveAsFile from '../';

commander
  .version(version, '-V, --version')
  .arguments('<url>')
  .usage('[options] <Directory> <URL>')
  .option('-o, --output [path]', 'output path')
  .action((url) => {
    try {
      saveAsFile(url, commander.output);
      process.exit(0);
    } catch (e) {
      process.exit(1);
    }
  })
  .parse(process.argv);
