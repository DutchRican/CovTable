#!/usr/bin/env node
// const { Table } = require('console-table-printer');
const { TableCli } = require('@dutchrican/tablecli');
const createOutput = require('../lib/main');

(async function main() {
   const argv = require('yargs')
      .version('0.0.1')
      .option('counter', {
         alias: 'x',
         describe: 'Top x to generate the table, 0 will show all',
         default: 10,
         type: 'number',
      })
      .option('country', {
         alias: 'c',
         describe: 'Country information, no world stats will be provided',
         type: 'string'
      })
      .option('world', {
         alias: 'w',
         describe: 'Exclude World stats',
         type: 'boolean'
      })
      .option('color', {
         alias: 'm',
         describe: 'Display in multiple colors',
         type: 'boolean'
      })
      .option('border', {
         alias: 'b',
         describe: 'Show double line border',
         type: 'boolean'
      })
      .option('list', {
         alias: 'l',
         describe: 'Show all available countries',
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

   if(argv.l) {
      const countries = require('../lib/country_code_map.json');
      const p = new TableCli();
      p.setData(countries);
      console.log('\n');
      p.showTable();
      process.exit(0);
   }
   try {
      const countries = await createOutput(argv.x, !argv.w, argv.c);

      const options = {
         borderType: argv.b ? 'double' : 'default',
         title: 'Covid-19 as of ' + Date(),
         columnInformation: argv.m
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
      console.log('\n' + err.message);
      process.exit(1);
   }
})();
