#!/usr/bin/env node
import commander from 'commander';
import os from 'os';
import { version } from '../../package.json';
import savePage from '../';

const homedir = os.homedir();

commander
  .version(version, '-V, --version')
  .arguments('<url>')
  .usage('[options] <Directory> <URL>')
  .option('-o, --output [path]', 'output path', homedir)
  .action((url) => {
    savePage(url, commander.output)
      .catch(() => process.exit(1));
  })
  .parse(process.argv);
