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
$> DEBUG=ficspressiso ./bin/www
  ~ OR ~
$> ./run.sh
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
mongo> db.documents.createIndex({ author: 1, title: 1 })
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

### notes

something weird it up right now with semantic-ui installation.   
