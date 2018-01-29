const express = require('express');
const router = express.Router();

/* GET home page. */
router.get(['/', '/chart', '/browse', '/library', '/top'], (req, res) => {

  res.render('index', {
    title: 'ficspressiso'
  });
});

module.exports = router;
