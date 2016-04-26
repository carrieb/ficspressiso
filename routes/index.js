var express = require('express');
var router = express.Router();
const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');

var database = null;

var url = 'mongodb://localhost:27017/fanfic';

require("node-jsx").install({
    harmony: true,
    extension: ".jsx"
});

var browseUrl = 'https://www.fanfiction.net/book/Harry-Potter/?&srt=1&lan=1&r=10&len=20&c1=3';

var React = require("react"),
    ReactDOMServer = require('react-dom/server'),
    App = React.createFactory(require("../public/javascripts/components/app")),
    ChartApp = React.createFactory(require("../public/javascripts/components/chartapp")),
    BrowseItem = React.createFactory(require("../public/javascripts/components/browseitem")),
    FFMeta = [],
    CharMeta = [],
    FandomMeta = [];

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/fanfic';
// Use connect method to connect to the Server

var randomColor = function() {
  colors = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"];
  return colors[Math.floor(Math.random() * colors.length)]
}

var updateFFMeta = function() {
  tempMeta = []
  fs.readdir('/Users/carolyn/Desktop/fanfiction/', (err, files) => {
    if (err) throw err;
    for (var i = 0; i < files.length; i++) {
      var fileName = files[i];
      if (fileName != '.DS_Store') {
        fs.readFile('/Users/carolyn/Desktop/fanfiction/' + fileName + '/metadata.json', 'utf8', (err, data) => {
          if (err) throw err;
          metadata = JSON.parse(data);
          // TODO: make this intelligent for any de-duping (ao3 vs. ffnet)
          for (var i = 0; i < metadata['chars'].length; i++) {
            var char = metadata['chars'][i];
            if (CharMeta.map((x) => { return x.name }).indexOf(char) === -1) {
              CharMeta.push({"name": char, "color": randomColor() });
            }
          }
          for (var j = 0; j < metadata['fandoms'].length; j++) {
            var fandom = metadata['fandoms'][j];
            if (FandomMeta.map((x) => { return x.name }).indexOf(fandom) === -1) {
              FandomMeta.push({"name": fandom, "color": randomColor() });
            }
          }
          tempMeta.push(metadata);
        });
      }
    }
    FFMeta = tempMeta;
    console.log("Updated fic data.");
  });
}

updateFFMeta();

setTimeout(updateFFMeta, 120000); // every 2 mins

router.get('/ajax/filter_meta', function(req, res) {
  res.json({
    'fandoms' : FandomMeta,
    'characters' : CharMeta
  });
});

router.get('/ajax/ff_meta', function(req, res) {
  q = req.query.q;
  var result = []
  // query format: json? { 'character': ... , 'fandom': ... }
  for (var i = 0; i < FFMeta.length; i++) {
    var matchesQuery = true;
    fic_meta = FFMeta[i];
    if (q) {
      var matchesFandom = true;
      var matchesCharacter = true;
      if ('fandom' in q) {
        matchesFandom = fic_meta['fandoms'].indexOf(q['fandom']) > -1
      }
      if ('character' in q) {
        matchesCharacter = fic_meta['chars'].indexOf(q['character']) > -1
      }
      matchesQuery = matchesCharacter && matchesFandom
    }
    if (matchesQuery) {
      result.push(fic_meta);
    }
  }
  res.json(result);
});

var getMetaForFic = function(title) {
  for (var i = 0; i < FFMeta.length; i++) {
    var fic = FFMeta[i];
    if (fic['title'] === title) {
      return fic;
    }
  }
  return null;
}

router.get('/ajax/ff_content', function(req, res) {
  var title = req.query.title;
  var chp = req.query.chp;
  var fic_meta = getMetaForFic(title);
  if (fic_meta) {
    fs.readFile('/Users/carolyn/Desktop/fanfiction/' + title + '/' + fic_meta['chapters'][chp]['title'] + ".txt", 'utf8', (err, data) => {
      if (err) throw err;
      res.json(data);
    });
  } else {
    res.status(500).send("error fic " + title + " doesn't exist.");
  }
});

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
  https.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

var browse_data = [];

var cleanCharName = function(str) {
  return str.replace('[', '').replace(']', '').trim();
}

var findChars = function(str) {
  var items = str.split(' - ');
  var last = items[items.length -1];
  console.log(last);
  var chars = [];
  if (last === 'Complete') {

  } else {
    if (!last.startsWith('Published:')) {
      var raw_chars = last.split(', ');
      for (var raw_char in raw_chars) {
        chars.push(cleanCharName(raw_chars[raw_char]));
      }
    }
  }
  console.log('Found characters:', chars);
  return chars;
}

var processLatestFics = function(page, fandom, character, callback, done) {
  browse_data = []
  const url = `https://www.fanfiction.net/book/Harry-Potter/?&srt=1&lan=1&r=10&len=20&p=${page}`;
  download(url, (data) => {
    if (data) {
      var $ = cheerio.load(data);
      $('.cimage').remove();
      var list = '';
      $("div.z-list").each(function(i, e) {
        //list = list + $(this).addClass('item').css('width', '100%');
        var title = $(this).find('.stitle').first().text();
        var url = $(this).find('.stitle').first().attr('href');
        var author = $(this).find('a[href^="/u/"]').first().text();
        var extra = $(this).find('div.z-padtop2').first().text();
        var summary = $(this).find('div.z-padtop').first().contents().first().text();
        var chars = findChars(extra);
        var fic = {
          title: title,
          url: url,
          author: author,
          extra: extra,
          summary: summary,
          chars: chars
        };
        browse_data.push(fic);
        callback(fic);
      });
      console.log('Retrieved ' + browse_data.length + ' fics from ff.net');
      done();
    } else {
      console.error(`Could not retrieve data for url ${url}`);
    }
  });
}

var chart_data = null;

// TODO: do this while we are getting the fics? (for each char);
var fillChartData = function() {
  chart_data = {
    labels: [],
    data: [],
  }

  for (var i in browse_data) {
    console.log(browse_data[i].chars);
    for (var j in browse_data[i].chars) {
      var idx = chart_data.labels.indexOf(browse_data[i].chars[j]);
      if (idx > -1) {
        chart_data.data[idx] = chart_data.data[idx] + 1;
      } else {
        chart_data.labels.push(browse_data[i].chars[j]);
        chart_data.data.push(1);
      }
    }
  }
  console.log(chart_data);
}

processLatestFics(1, null, null, function(item) {}, function() { });

router.get('/ajax/chart_data', function(req, res) {
  processLatestFics(req.query.page, null, null, function(item) {}, function() {
    fillChartData();
    console.log(chart_data);
    res.json(chart_data);
  })
});

router.get('/ajax/browse', function(req, res) {
  const page = req.query.page;
  const fandom = req.query.fandom;
  const character = req.query.character; // TODO: convert to value for ffnet..? (using page??);
  var list = '';
  processLatestFics(page, fandom, character, function(fic) {
    // TOOD: move this to the client
    list = list + ReactDOMServer.renderToString(BrowseItem(fic));
  }, function() {
    res.send(list);
  });
});

/* GET home page. */
router.get('/', function(req, res) {
  var markup = ReactDOMServer.renderToString(App({
    initialSection: 'Library'
  }));

  res.render('index', {
    title: 'ficspressiso',
    markup: markup,
    initialSection: 'Library'
  });
});

router.get('/browse', function(req, res) {
  var markup = ReactDOMServer.renderToString(App({
    initialSection: 'Browse',
    renderChart: false
  }));

  res.render('index', {
    title: 'ficspressiso',
    markup: markup,
    initialSection: 'Browse'
  });
});

router.get('/chart', function(req, res) {
  var markup = ReactDOMServer.renderToString(App({
    initialSection: 'Chart',
    renderChart: false
  }));

  res.render('index', {
    title: 'ficspressiso',
    markup: markup,
    initialSection: 'Chart'
  });
});

var buf = ''
var fic_db = null;
var FINISH_SIGNAL = "***FINISHED***"
function pump() {
  var pos;

  while ((pos = buf.indexOf('  \}')) >= 0) { // keep going while there's a newline somewhere in the buffer
    processFicJson(buf.slice(0,pos+3)); // hand off the line
    buf = buf.slice(pos+3); // and slice the processed data off the buffer
  }

  console.log(buf);

  if (buf.endsWith(FINISH_SIGNAL)) {
    fic_db.close()
    fic_db = null;
  }
}

var insertFicDoc = function(fic, callback) {
  // Get the documents collection
  var collection = fic_db.collection('documents');
  // Insert some documents
  collection.insertOne(fic, function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}

function processFicJson(fic) {  // here's where we do something with a line
  fic = fic.trim()

  if (fic.startsWith(',')) {
    fic = fic.slice(1)
  }

  if (fic.length > 0) { // ignore empty lines
    var obj = JSON.parse(fic); // parse the JSON
    insertFicDoc(obj, function() {
      console.log("Inserted " + obj['title']);
    })
  }
}

var FF_JSON = '/Users/carolyn/Desktop/compiled_fanfic.json';
router.get('/fill_in_db', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server", db);
    fic_db = db;

    var stream = fs.createReadStream(FF_JSON, {
      'flags' : 'r',
      'encoding' : 'utf-8'
    })

    stream.on('data', function(d) {
      buf += d.toString().replace('[', '').replace(']', '');
      // when data is read, stuff it in a string buffer
      pump();
    });

    stream.on('end', () => {
      console.log("END");
      pump("***FINSIHED***");
    })
  });
  console.log('finished');
  res.json('OK');
});

module.exports = function(db) {
  database = db;
  return router;
};
