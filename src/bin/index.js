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
    saveAsFile(url, commander.output)
      .catch(() => process.exit(1));
  })
  .parse(process.argv);
