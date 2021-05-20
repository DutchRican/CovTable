const cheerio = require('cheerio');
const { Spinner } = require('status-spin');
const { fetchPage } = require('./dataFetch');

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

function stripCommaOrNA(item) {
   return item.trim().replace(/,/g, '').replace(/\n/g, '') || 'N/A';
}
/**
 * Making a nested array out of cheerio elements
 * @param {*} items Cheerio format
 * @param {number} count row count for the data table
 * @param {boolean} includeWorld include world information
 * @returns {Array<[string|number]>} sorted array 
 */
function createList($, items, count, includeWorld) {
   if (includeWorld) ++count;
   return $(items)
      .toArray()
      .map(el => $(el).find('td'))
      .filter(el => includeWorld
         ? $(el[0]).text() !== '' || $(el[1]).text().toUpperCase() === 'WORLD'
         : $(el[0]).text() !== ''
      )
      .map(el => $(el).toArray().map(item => getClean(stripCommaOrNA($(item).text().trim()))))
      .sort((a, b) => a[2] < b[2] ? 1 : -1)
      .slice(0, count < 2 ? undefined : count);
}

/**
 * Array to Array of Objects 
 * @param {Array<[string|number]>} list
 * @returns {Array.<{key: string, value: string|number}>} Array of objects with the column and value
 */
function listToObject(list, isCountry = false) {
   const header = isCountry ? 'State/Region' : 'Country';
   return list.reduce((acc, curr) => ([
      ...acc, {
         [header]: curr[1],
         'Total Cases': numberWithCommas(curr[2]),
         'New Cases': numberWithCommas(curr[3]),
         'Total Deaths': numberWithCommas(curr[4]),
         'New Deaths': numberWithCommas(curr[5]),
         'Recovered': numberWithCommas(curr[6]),
         'Active Cases': numberWithCommas(isCountry ? curr[7] : curr[8]),
         'Total Tested': numberWithCommas(isCountry ? curr[10] : curr[12])
      }
   ]), []);
}

/**
 * 
 * @param {cheerio object} page 
 * @returns {[strings]} array of strings [countryName, totalCases, newCases, totalDeaths, newDeaths, recovered, activeCases, totalTested]
 */
function getSingleCountryInformation(page) {
   const countryName = page('h1').first().text().trim();
   const mainNumbers = page('#maincounter-wrap').toArray().map(el => stripCommaOrNA(page(el).text()).split(':')[1]).filter(el => el) || [];
   const newNumbers = stripCommaOrNA(page('.news_post').first().text()).match(/\d+/g) || [];
   const active = (parseInt(mainNumbers[0]) - parseInt(mainNumbers[1]) - parseInt(mainNumbers[2])) || 'N/A';
   return {
      'State/Region': countryName,
      'Total Cases': numberWithCommas(mainNumbers[0] || 'N/A'),
      'New Cases': numberWithCommas(newNumbers[0] || 'N/A'),
      'Total Deaths': numberWithCommas(mainNumbers[1] || 'N/A'),
      'New Deaths': numberWithCommas(newNumbers[1] || 'N/A'),
      'Recovered': numberWithCommas(mainNumbers[2] || 'N/A'),
      'Active Cases': numberWithCommas(active),
      'Total Tested': 'N/A'
   }
}

/**
 * @param {number} count 
 * @param {boolean} includeWorld
 * @returns {Array.<{key: String, value:Number|string}>} Array of objects 
 */
async function createOutput(count, includeWorld, country) {
   const tableSelector = '#nav-today tbody'
   try {
      const spinner = new Spinner({ spinnerType: 'dots', message: 'Fetching data from WorldOmeters' });
      spinner.start();
      const data = await fetchPage(country);
      const $ = cheerio.load(data);
      const parsed = $(tableSelector).find('tr');
      const countries = listToObject(createList($, parsed, count, includeWorld), !!country);
      !!country && countries.unshift(getSingleCountryInformation($));
      spinner.stop();
      return countries;
   } catch (err) {
      throw new Error(err);
   }
}

module.exports = createOutput;
