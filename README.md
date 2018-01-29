# ficspressiso

#### dependencies
###### webapp
* nodejs
* mongodb

###### crawler
* chromedriver

#### setup & running
###### webapp
```
npm install
```

```
$> webpack --watch
$> node webapp.js
```

###### crawler
```
pip install ??
```
```
$ /tools> ./metadata_crawler.py
```

###### db
```
sudo service mongod start
```
```
$> mongo
mongo> use fanfic
mongo> db.documents.createIndex({ author: 1, title: 1, site: 1 })
```

### credits

* express
* react
* webpack
* mongodb
* selenium
* chromedriver
* cheerio
* semantic-ui
* lodash
* chart.js
* randomcolor