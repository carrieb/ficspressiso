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
  }
};

module.exports = util;
