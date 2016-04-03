var express = require('express');
var router = express.Router();
const fs = require('fs');

var database = null;

var url = 'mongodb://localhost:27017/fanfic';

require("node-jsx").install({
    harmony: true,
    extension: ".jsx"
});

var React = require("react"),
    App = React.createFactory(require("../public/javascripts/components/app")),
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

/* GET home page. */
router.get('/', function(req, res) {
  var markup = React.renderToString(App());

  res.render('index', {
    title: 'ficspressiso',
    markup: markup
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
