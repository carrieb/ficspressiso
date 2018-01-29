// NOTE: have to use relative paths in node files
const ffnet = require('../src/ffnet');

const apicache = require('apicache');
let cache = apicache.middleware;

var express = require('express');
var router = express.Router();

const moment = require('moment');

const DAO = require('../src/dao');
const Timeline = require('../src/timeline');
const Sources = require('../src/constants/sources');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

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

router.get('/browse', cache('1 hour'), function(req, res) {
  const page = req.query.page;
  const fandom = req.query.fandom || 'Harry Potter';
  const characters = req.query.characters || [];
  ffnet.retrieveFics(page, fandom, characters, (data) => {
    DAO.saveFics(data);
    res.json(data);
  });
});

router.get('/characters', cache('1 day'), function(req, res) {
  // const fandom = req.query.fandoms || ['Harry Potter'];
  // ffnet.retrieveCharacters(fandom, (data) => {
  //   res.json(data);
  // });
  DAO.getCharacters(req.app.locals.db, (characters) => {
    res.json(characters);
  });
});

router.get('/fandoms', cache('1 day'), function(req, res) {
  DAO.getFandoms(req.app.locals.db, (fandoms) => {
    res.json(fandoms);
  });
});

router.get('/top/data', cache('1 day'), (req, res) => {
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


router.get('/chart/data', cache('1 day'), function(req, res) {
  try {
    DAO.aggregateNumFics(req.query, 'month', (labels, datasets) => {
      try {
        res.json({ labels, datasets });
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.error(e);
  }
});

router.get('/fic/timeline', cache('1 day'), function(req, res) {
  try {
    Timeline.inferTimeline(Sources.FFNET, req.query.id, (timeline) => {
      // TODO: save timeline to fic in db
        res.json(timeline);
    });
  } catch (e) {
    console.error(e);
  }
});

router.put('/fic', jsonParser, function(req, res) {
  try {
    const fics = req.body.fics;
    // DAO.saveFics(fics, (saved) => {
    //   res.send(saved);
    // });
    const saved = [];
    fics.forEach((fic) => {
      DAO.saveFic(req.app.locals.db, fic, (fic) => {
        saved.push(fic);
        if (saved.length === fics.length) {
          res.send(saved);
        }
      });
    });
  } catch (e) {
    console.error(e);
  }
});

router.post('/find/fic', jsonParser, function(req, res) {
  try {
    console.log(req.body);
    const q = req.body.q;
    DAO.findFicLike(q, (fic) => {
      console.log(fic);
      res.send(fic);
    });
  } catch (e) {
    console.error(e);
  }
});

router.post('/fic/feedback', jsonParser, function(req, res) {
  try {
    const fic = req.body.fic;
    const feedback = req.body.feedback;
    console.log(fic, feedback);
    DAO.rateAndSave(fic, feedback, () => res.send('OK'));
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
