#!/usr/bin/env node
// const { Table } = require('console-table-printer');
const { TableCli } = require('@dutchrican/tablecli');

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
      .option('world', {
         alias: 'w',
         describe: 'Show World stats',
         default: false,
         type: 'boolean'
      })
      .option('color', {
         alias: 'c',
         describe: 'turn off colors',
         default: false,
         type: 'boolean'
      })
      .option('border', {
         alias: 'b',
         describe: 'double line border',
         default: false,
         type: 'boolean'
      })
      .check((argv) => {
         if (Number.isInteger(argv.x)) {
            return true;
         } else {
            throw new Error('Please provide a numerical value for the counter\n');
         }
      })
      .help()
      .argv;

   try {
      const countries = await createOutput(argv.x, argv.w);

      const options = {
         borderType: argv.b ? 'double' : 'default',
         columnInformation: argv.c
            ? [{ color: 'white_bold' },
            { color: 'blue' },
            { color: 'magenta' },
            { color: 'red' },
            { color: 'red' },
            { color: 'green' },
            { color: 'yellow' },
            { color: 'cyan' }]
            : []
      }
      const p = new TableCli(options);
      p.setData(countries);
      console.log('\n');
      p.showTable();
   } catch (err) {
      console.log(err.message);
      process.exit(1);
   }
})();
