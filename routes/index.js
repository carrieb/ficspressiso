var express = require('express');
var router = express.Router();
const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');

const ffnet = require('../src/ffnet');

var database = null;

var url = 'mongodb://localhost:27017/fanfic';

require("node-jsx").install({
    harmony: true,
    extension: ".jsx"
});

var React = require("react"),
    CharNameToQueryValue = {};

// Keep a mapping of char name to value
// Update every time we request a page (?)

let myLibrary = null;

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/fanfic';
// Use connect method to connect to the Server

var randomColor = function() {
  colors = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"];
  return colors[Math.floor(Math.random() * colors.length)]
}

//updateFFMeta();

//setTimeout(updateFFMeta, 120000); // every 2 mins


var getMetaForFic = function(title) {
  const library = myLibrary.get()
  for (var i = 0; i < library.stories.length; i++) {
    var fic = library.stories[i];
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
    fs.readFile('/home/carrie/Desktop/fanfiction/' + title + '/' + fic_meta['chapters'][chp]['title'] + ".txt", 'utf8', (err, data) => {
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
  return chars;
}

var processLatestFics = function(page, fandom, character, callback, done) {
  browse_data = [];
  const char_id = CharNameToQueryValue[character];
  const url = `https://www.fanfiction.net/book/Harry-Potter/?&srt=1&lan=1&r=10&len=20&p=${page}&c1=${char_id}`;
  download(url, (data) => {
    if (data) {
      var $ = cheerio.load(data);
      $('.cimage').remove();
      var list = '';
      $('select[name="characterid1"] option').each(function(i, e){
          if ($(this).val() > 0) {
            CharNameToQueryValue[$(this).text()] = $(this).val();
          }
      });
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
}

processLatestFics(1, null, null, function(item) {}, function() { });

router.get('/ajax/chart_data', function(req, res) {
  var character = req.query.character;
  processLatestFics(req.query.page, null, null, function(item) {}, function() {
    fillChartData();
    res.json(chart_data);
  })
});

router.get('/ajax/browse', function(req, res) {
  const page = req.query.page;
  const fandom = req.query.fandom || 'Harry Potter';
  const character = req.query.character;
  ffnet.retrieveFics(page, fandom, character, (data) => {
    console.log(data);
    res.json(data);
  });
});

/* GET home page. */
router.get('/', function(req, res) {
  /*var markup = ReactDOMServer.renderToString(App({
    initialSection: 'Library'
  }));*/

  res.render('index', {
    title: 'ficspressiso',
    markup: null,
    initialSection: 'Library'
  });
});

router.get('/ajax/browse_filter', function(req, res) {
  var query = req.query.q;
  var results = []
  for (var p in CharNameToQueryValue) {
    if (p.toLowerCase().indexOf(query.toLowerCase()) > -1) {
      results.push({ title: p });
    }
  }
  res.json({
    results: {
      characters: {
        name: "Characters",
        results: results
      }
    }
  });
});

router.get('/browse', function(req, res) {
  // var markup = ReactDOMServer.renderToString(App({
  //   initialSection: 'Browse',
  //   renderChart: false
  // }));

  res.render('index', {
    title: 'ficspressiso',
    markup: null,
    initialSection: 'Browse'
  });
});

router.get('/chart', function(req, res) {
  // var markup = ReactDOMServer.renderToString(App({
  //   initialSection: 'Chart',
  //   renderChart: false
  // }));

  res.render('index', {
    title: 'ficspressiso',
    markup: null,
    initialSection: 'Chart'
  });
});

module.exports = function(library) {
  console.log('HEYYYY', library != null);
  myLibrary = library;

  router.get('/ajax/filter_meta', function(req, res) {
    const lib = library.get();
    console.log(lib.fandoms);
    res.json({
      'fandoms' : lib.fandoms,
      'characters' : lib.characters
    });
  });

  router.get('/ajax/ff_meta', function(req, res) {
    q = req.query.q;
    var result = []
    // query format: json? { 'character': ... , 'fandom': ... }
    const lib = library.get();
    for (var i = 0; i < lib.stories.length; i++) {
      var matchesQuery = true;
      fic_meta = lib.stories[i];
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

  return router;
};
