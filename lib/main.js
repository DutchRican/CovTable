const cheerio = require('cheerio');
const axios = require('axios');

const URL = 'https://www.worldometers.info/coronavirus';

async function fetchPage() {
   const { data } = await axios.get(URL);
   return cheerio.load(data);
}

function getClean(text) {
   const num = Number.parseInt(text);
   if (!Number.isNaN(num)) return num;
   return text;
}

function numberWithCommas(num) {
   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function createList(items, count, includeWorld) {
   const moddedCount = count === -1 ? -1 : includeWorld ? count + 1 : count;
   return items
      .toArray()
      .map(el => cheerio(el).find('td'))
      .filter(el => includeWorld
         ? cheerio(el[0]).text() !== '' || cheerio(el[1]).text().toUpperCase() === 'WORLD'
         : cheerio(el[0]).text() !== ''
      )
      .map(el => cheerio(el).toArray().map(item => getClean(cheerio(item).text().trim().replace(/,/g, '') || 'N/A')))
      .sort((a, b) => a[2] < b[2] ? 1 : -1)
      .slice(0, moddedCount);
}

function listToObject(list) {
   return list.reduce((acc, curr) => ([
      ...acc, {
         'Country': curr[1],
         'Total Cases': numberWithCommas(curr[2]),
         'New Cases': numberWithCommas(curr[3]),
         'Total Deaths': numberWithCommas(curr[4]),
         'New Deaths': numberWithCommas(curr[5]),
         'Recovered': numberWithCommas(curr[6]),
         'Active Cases': numberWithCommas(curr[8]),
         'Total Tested': numberWithCommas(curr[12])
      }
   ]), []);
}

async function createOutput(count, includeWorld) {
   const $ = await fetchPage();
   const parsed = $('#nav-today #main_table_countries_today').find('tr');
   const countries = listToObject(createList($(parsed), count, !includeWorld));
   return countries;
}

module.exports = createOutput;
