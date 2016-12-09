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
  }
};

module.exports = util;
