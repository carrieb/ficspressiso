// NOTE: have to use relative paths in node files
const ffnet = require('../src/ffnet');
const ao3 = require('../src/ao3');
const library = require('../src/library');

const apicache = require('apicache');
let cache = apicache.middleware;

const express = require('express');
const router = express.Router();

const moment = require('moment');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const DAO = require('../src/dao');
const Timeline = require('../src/timeline');
const Sources = require('../src/constants/sources');

const config = require('../config');

const onlyStatus200 = (req, res) => res.statusCode === 200;

router.get('/library', function(req, res) {
  res.json(library.fics);
});

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

router.post('/browse', jsonParser, (req, res) => {
  console.log(req.body);
  const site = req.body.sites ? req.body.sites[0] : 'fanfiction.net';
  const page = req.body.page || 1;
  const fandom = req.body.fandoms || ['Harry Potter'];
  const characters = req.query.characters || [];
  if (site === 'fanfiction.net') {
    ffnet.retrieveFics(page, fandom, characters, (data) => {
      DAO.saveFics(req.app.locals.db, data, (fics) => {
        //console.log(fics);
      });
      //console.log(data);
      res.json(data);
    });
  } else {
    ao3.retrieveFics(req.body, (data) => {
      //console.log(data);
      res.json(data);
    })
  }

});

router.get('/characters', cache('1 day', onlyStatus200), function(req, res) {
  DAO.getCharacters(req.app.locals.db, (characters) => {
    res.json(characters);
  });
});

router.get('/fandoms', cache('1 day', onlyStatus200), function(req, res) {
  // TODO: pass site into query
  DAO.getFandoms(req.app.locals.db, (fandoms) => {
    res.json(fandoms);
  });
});

router.get('/ratings', cache('1 day', onlyStatus200), (req, res) => {
  // DAO.getRatings(req.app.locals.db, req.query.site, (ratings) => {
  //   res.json(ratings);
  // }, (error) => {
  //   res.error(`Unable to lookup fandoms for ${req.query.site}: ${error.message}`);
  // });

  // mock data
  res.json([{ rating: 'K', count: 1 }, { rating: 'T', count: 1 }, { rating: 'M', count: 1 }, { rating: 'E', count: 1 }]);
});

const PythonShell = require('python-shell');

const extractCurrentProgress = function(str) {
  const idRegex = new RegExp('Retrieved chapter (\\d+).*', 'g');
  const m = idRegex.exec(str);
  if (m) {
    const progress = parseInt(m[1]);
    return progress;
  } else {
    return null;
  }
};

router.get('/download', (req, res) => {
  console.log(config.toolsDir);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  const pyshell = new PythonShell('downloadff.py', {
      scriptPath: config.toolsDir,
    args: ['--ao3', '13060209']
  });

  pyshell.on('message', (message) => {
    const p = extractCurrentProgress(message);
    console.log(message, p);
    if (p) {
      res.write(p+"\n");
      // TODO: figure how to not compress this response...
      res.flush();
    }
  });

  pyshell.end((err) => {
    if (err) throw err;
    console.log('finished');
    res.status(200).end();
  });
})

router.get('/top/data', cache('1 day', onlyStatus200), (req, res) => {
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


router.get('/chart/data', cache('1 day', onlyStatus200), function(req, res) {
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

router.get('/fic/timeline', cache('1 day', onlyStatus200), function(req, res) {
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
