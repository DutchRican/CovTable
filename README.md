## quick easy view of the covid status globally

Install with:  
`npm i -g covtable`


Information is scraped from [WorldOMeter]('https://www.worldometers.info/coronavirus/') Please make sure to visit their site.

I merely parsed the html with [cheeriojs/cheerio]('https://github.com/cheeriojs/cheerio') and did not alter any of the statistics returned.

run with:  
<pre>
covtable --version      Show version number                                   [boolean]
covtable  --counter, -x  Top x to generate the table, 0 will show all
                                                          [number] [default: 10]
covtable  --country, -c  Country information, no world stats will be provided   [string]
covtable  --world, -w    Exclude World stats                                   [boolean]
covtable  --color, -m    Display in multiple colors                            [boolean]
covtable  --border, -b   Show double line border                               [boolean]
covtable  --help         Show help                                             [boolean]
</pre>

### Ouput examples
![single example](./images/single_border.png)  
![double example](./images/double_border.png)  
![single color example](./images/single_border_color.png)  
![double color example](./images/double_border_color.png)