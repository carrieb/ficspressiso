const ffnet = require('../src/ffnet');

var express = require('express');
var router = express.Router();

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

module.exports = router;
