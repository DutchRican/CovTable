## quick easy view of the covid status globally

Install with:  
`npm i -g covid-by-country`


Information is scraped from [WorldOMeter]('https://www.worldometers.info/coronavirus/') Please make sure to visit their site.

I merely parsed the html with [cheeriojs/cheerio]('https://github.com/cheeriojs/cheerio') and did not alter any of the statistics returned.

run with:  
`covtable` - this will provide a full table of all countries.  
`covtable --help` - see the currently available options.  
`covtable -x <number>` will show top x.  
`covtable -w ` not include the World stats.


output:  
`
paul@pauls-air covCol % covtable -x 5
`
![output example](/output.png)