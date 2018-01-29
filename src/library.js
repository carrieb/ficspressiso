const fs = require('fs');
const config = require('../config');

const stories = [];
const characters = new Set();
const fandoms = new Set();

fs.readdir(config.libraryDir, (err, files) => {
  if (err) throw err;

  files.forEach((f) => {
      if (f === '.DS_Store') {
          return;
      } else {
        const metadataPath = config.libraryDir + f + '/metadata.json';
        fs.readFile(metadataPath, 'utf8', (err, data) => {
          if (err) throw err;

          const metadata = JSON.parse(data);
          metadata.characters.map((character) => {
            characters.add(character);
          });

          metadata.fandoms.map((fandom) => {
            fandoms.add(fandom);
          });

          stories.push(metadata);
        });
      }
  });
});

const Library = { stories, characters, fandoms };

module.exports = Library;
