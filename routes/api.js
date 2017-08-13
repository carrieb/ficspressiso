const ffnet = require('../src/ffnet');

var express = require('express');
var router = express.Router();

const moment = require('moment');

const DAO = require('../src/dao');

router.get('/reindex', function(req, res) {
  const url = req.query.url;
  //console.log(url);
  ffnet.retrieveFic(url, (data) => {
    console.log('data', data);
    if (data && data != null) {
      DAO.replaceFicData(url, data, () => {
        res.send(data);
      });
    } else { // set to deleted
      DAO.markAsDeleted(url, () => {
        res.send(null);
      });
    }
  });
});

router.get('/browse', function(req, res) {
  const page = req.query.page;
  const fandom = req.query.fandom || 'Harry Potter';
  const characters = req.query.characters || [];
  ffnet.retrieveFics(page, fandom, characters, (data) => {
    res.json(data);
  });
});

router.get('/characters', function(req, res) {
  const fandom = req.query.fandom || 'Harry Potter';
  ffnet.retrieveCharacters(fandom, (data) => {
    res.json(data);
  });
});

const deltaToLabelFormat = {
  'month' : 'MMMM'
}

const MIN = 25;
const MAX = 125;

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min = MIN, max=MAX) {
  return Math.random() * (max - min) + min;
}

router.get('/top/data', (req, res) => {
  //console.log(req.query);
  const characters = req.query.characters;
  const rating = req.query.rating;
  const start = req.query.start || '1990-09-27'; // default day i was born
  const end = req.query.end || moment().format('YYYY-MM-DD'); // default now
  const field = req.query.sort || 'fav_cnt';
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const minWords = req.query.minWords ? parseInt(req.query.minWords) : 0;
  const maxWords = req.query.maxWords ? parseInt(req.query.maxWords) : 10000000; // 10 million
  const page = req.query.page ? parseInt(req.query.page) : 1;

  try {
    DAO.getTop(characters, rating, start, end, field, limit, minWords, maxWords,  page, (topList) => {
      res.json(topList);
    });
  } catch (e) {
    console.error(e)
  }
});


router.get('/chart/data', function(req, res) {
  try {
    DAO.aggregateNumFics(req.query, 'month', (labels, datasets) => {
      //console.log(labels, datasets);
      res.json({ labels, datasets });
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
