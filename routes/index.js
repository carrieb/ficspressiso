var express = require('express');
var router = express.Router();
const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');

const config = require('../config.js');

const ffnet = require('../src/ffnet');

const library = require('../src/library');

var database = null;

var url = 'mongodb://localhost:27017/fanfic';

var React = require("react"),
    CharNameToQueryValue = {};

// Keep a mapping of char name to value
// Update every time we request a page (?)

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/fanfic';
// Use connect method to connect to the Server

var randomColor = function() {
  colors = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"];
  return colors[Math.floor(Math.random() * colors.length)]
}

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
    fs.readFile(config.fanfiction_dir + title + '/' + fic_meta['chapters'][chp]['title'] + ".txt", 'utf8', (err, data) => {
      if (err) throw err;
      res.json(data);
    });
  } else {
    res.status(500).send("error fic " + title + " doesn't exist.");
  }
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

/* GET home page. */
router.get(['/', '/browse', '/library', '/new-library', '/chart', '/settings', '/top'], function(req, res) {
  const initJson = {
    stories: library.stories,
    characters: Array.from(library.characters),
    fandoms: Array.from(library.fandoms)
  };

  res.render('index', {
    title: 'ficspressiso',
    markup: null,
    initJson: JSON.stringify(initJson)
  });
});

module.exports = router;
