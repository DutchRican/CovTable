const cheerio = require('cheerio');
const axios = require('axios');
const { Spinner } = require('status-spin');

const URL = 'https://www.worldometers.info/coronavirus';

async function fetchPage() {
   try {
      const { data } = await axios.get(URL);
      return cheerio.load(data);
   } catch (err) {
      throw new Error('Could not retrieve raw data from: ' + URL);
   }
}

/**
 * 
 * @param {string} text 
 * @returns {string|number} 
 */
function getClean(text) {
   const num = Number.parseInt(text);
   if (!Number.isNaN(num)) return num;
   return text;
}

/**
 * Formatting the number
 * @param {number} num
 * @returns {string}  
 */
function numberWithCommas(num) {
   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Making a nested array out of cheerio elements
 * @param {*} items Cheerio format
 * @param {number} count row count for the data table
 * @param {boolean} includeWorld include world information
 * @returns {Array<[string|number]>} sorted array 
 */
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

/**
 * Array to Array of Objects 
 * @param {Array<[string|number]>} list
 * @returns {Array.<{key: string, value: string|number}>} Array of objects with the column and value
 */
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

/**
 * @param {number} count 
 * @param {boolean} includeWorld
 * @returns {Array.<{key: String, value:Number|string}>} Array of objects 
 */
async function createOutput(count, includeWorld) {
   try {
      const spinner = new Spinner({ spinnerType: 'track', message: 'Fetching data from WorldOmeters'});
      spinner.start();
      const $ = await fetchPage();
      const parsed = $('#nav-today #main_table_countries_today').find('tr');
      const countries = listToObject(createList($(parsed), count, !includeWorld));
      spinner.stop();
      return countries;
   } catch (err) {
      throw new Error(err);
   }
}

module.exports = createOutput;
