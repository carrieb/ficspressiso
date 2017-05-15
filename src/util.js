const https = require('https');

// Utility function that downloads a URL and invokes
// callback with the data.
const util = {
  download(url, callback) {
    https.get(url, function(res) {
      var data = '';
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function() {
        callback(data);
      });
    }).on('error', function(err) {
      console.log(err)
      callback(null);
    });
  },

  randomColor() {
    const colors = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"];
    return colors[Math.floor(Math.random() * colors.length)]
  },

  emptyFicObj() {
    return {
      title: null,
      url: null,
      id: null,
      author: null,
      author_url: null,
      summary: null,
      raw_extra: null,
      characters: [],
      rating: null,
      word_cnt: 0,
      chapter_cnt: 0,
      review_cnt: 0,
      fav_cnt: 0,
      follow_cnt: 0,
      publish_date: null,
      update_date: null
    }
  }
};

module.exports = util;
