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

function createList(items, count) {
   return items
      .toArray()
      .map(el => cheerio(el).find('td'))
      .filter(el => cheerio(el[0]).text() !== '')
      .map(el => cheerio(el).toArray().map(item => getClean(cheerio(item).text().trim().replace(/,/g, '') || 'N/A')))
      .sort((a, b) => a[2] < b[2] ? 1 : -1)
      .slice(0, count);
}

function listToObject(list) {
   return list.reduce((acc, curr) => ({
      ...acc,
      [curr[1]]: {
         'Total Cases': curr[2],
         'New Cases': curr[3],
         'Total Deaths': curr[4],
         'New Deaths': curr[5],
         'Recovered': curr[6],
         'Active Cases': curr[8],
         'Total Tested': curr[12]
      },
   }), {});
}

async function createOutput(count) {
   const $ = await fetchPage();
   const parsed = $('#nav-today #main_table_countries_today').find('tr');
   const countries = listToObject(createList($(parsed), count));
   return countries;
}

module.exports = createOutput;
