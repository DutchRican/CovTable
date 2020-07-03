#!/usr/bin/env node
const createOutput = require('../lib/main');

(async function main() {
    const argv = require('yargs')
       .version('0.0.1')
       .option('counter', {
          alias: 'x',
          describe: 'Top x to generate the table',
          default: -1,
          type: 'number',
       })
       .check((argv) => { if (Number.isInteger(argv.x)) { return true } else { throw new Error('Please provide a numerical value for the counter\n'); } })
       .help()
       .argv;
 
    const countries = await createOutput(argv.x);
    console.table(countries);
 })();