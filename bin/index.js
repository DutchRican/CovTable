#!/usr/bin/env node
const { Table } = require('console-table-printer');
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
   const p = new Table({
      style: argv.b ? 'fatBorder' : 'thinBorder', title: 'Covid-19 as of ' + Date(), columns: [
         { name: 'Country', color: argv.c ? 'white' : 'white_bold', alignment: 'left' },
         { name: 'Total Cases', color: argv.c ? 'white' : 'blue' },
         { name: 'New Cases', color: argv.c ? 'white' : 'magenta' },
         { name: 'Total Deaths', color: argv.c ? 'white' : 'red' },
         { name: 'New Deaths', color: argv.c ? 'white' : 'red' },
         { name: 'Recovered', color: argv.c ? 'white' : 'green' },
         { name: 'Active Cases', color: argv.c ? 'white' : 'yellow' },
         { name: 'Total Tested', color: argv.c ? 'white' : 'cyan' },
      ]
   });
   countries.forEach(el => p.addRow(el));
   console.log('\n');
   p.printTable();
} catch (err) {
   console.log(err.message);
   process.exit(1);
}
})();