const fs = require('fs');

const config = require('../config.js');

const storyIndex = new Set(); // All entires of form 'title|||author'
const stories = [];
const characters = new Set();
const fandoms = new Set();

fs.readdir(config.fanfiction_dir, (err, files) => {
  if (err) throw err;

  files.map((f) => {
      // TODO: for mac, ignore .DS_Store
      if (f !== '.DS_Store') {
        const metadataPath = config.fanfiction_dir + f + '/metadata.json';
        fs.readFile(metadataPath, 'utf8', (err, data) => {
          if (err) throw err;

          const metadata = JSON.parse(data);
          // TODO: make this intelligent for any de-duping (ao3 vs. ffnet)
          metadata.chars.map((character) => {
            characters.add(character); // does de-duping
          });

          // ??: Can I not do this using the stories? Decoupling, right?
          metadata.fandoms.map((fandom) => {
            fandoms.add(fandom);
          });

          stories.push(metadata);
        });
      }
  });
});

// NOTE: Took out color geeneration here - should go client-side componentWillMount
const Library = { stories, characters, fandoms };

module.exports = Library;
