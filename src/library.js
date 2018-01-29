const fs = require('fs');
const config = require('../config');

const fics = [];

fs.readdir(config.libraryDir, (err, files) => {
  if (err) throw err;

  files.forEach((f) => {
      if (f === '.DS_Store') {
          return;
      } else {
        const metadataPath = config.libraryDir + f + '/metadata.json';
        fs.readFile(metadataPath, 'utf8', (err, data) => {
          if (err) {
              console.error(err);
              return;
          }

          const metadata = JSON.parse(data);
          fics.push(metadata);
        });
      }
  });
});

const Library = { fics };

module.exports = Library;
