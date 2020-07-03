## quick easy view of the covid status globally

Install with:  
`npm i -g covid-by-country`


Information is scraped from [WorldOMeter]('https://www.worldometers.info/coronavirus/') Please make sure to visit their site.

I merely parsed the html with [cheeriojs/cheerio]('https://github.com/cheeriojs/cheerio') and did not alter any of the statistics returned.

run with:  
`covstats` - this will provide a full table of all countries.  
`covstats --help` - see the currently available options.  
`covstats -x <number>` will show top x.