const ffnet = require('../src/ffnet');

var express = require('express');
var router = express.Router();

const moment = require('moment');

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


router.get('/chart/data', function(req, res) {
  console.log('hi', req.query);
  const qstart = req.query.start || '2016-07-01'; // yyyy/mm/dd
  const qend = req.query.end || '2016-12-31';
  const delta = req.query.delta || 'month';
  const characters = req.query.characters || [
    'Harry P.', 'Hermione G.', 'Tom R. Jr.', 'Ron W.', 'Draco M.'
  ];

  const start = moment(qstart);
  const end = moment(qend);

  const labels = [];
  const labelFormat = deltaToLabelFormat[delta];

  const datasets = characters.map((character) => {
    return {
      label: character,
      data: []
    };
  });
  // QUERY DB
  // -> FICS ADDED TO DB VIA SCRIPT CONSUMING json
  // -> JSON PRODUCED BY RUNNING CRAWLING SCRIPT

  // TODO: FIX CRAWLING SCRIPT TO BE FASTER
  // MUST PARSE OUT ID (objectId from (site + id))?
  // FIX CRAWLING SCRIPT TO BE INTELLIGENT ABOUT TIMESTAMPS (optionally take start/end times?);
  // RUN FOR JULY 1 -> DEC 31 2016
  // LOAD INTO DB (write script to consume JSON)

  // FOR NOW: mock data
  while (start < end) {
    labels.push(start.format(labelFormat));
    characters.forEach((character, idx) => {
      const random = getRandomArbitrary()
      datasets[idx].data.push(/* db.query(...char..date..delta) */random);
    });

    start.add(1, delta);
  }

  res.json({
    labels,
    datasets
  });
});

module.exports = router;
