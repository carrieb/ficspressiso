const fs = require('fs');

// NOTE: Took out color geeneration here - should go client-side componentWillMount
const Library = function(config) {
  const storyIndex = new Set(); // All entires of form 'title|||author'
  const stories = [];
  const characters = new Set();
  const fandoms = new Set();
  fs.readdir(config.fanfiction_dir, (err, files) => {
    if (err) throw err;

    files.map((f) => {
        // TODO: for mac, ignore .DS_Store
        const metadataPath = config.fanfiction_dir + f + '/metadata.json';
        fs.readFile(metadataPath, 'utf8', (err, data) => {
          if (err) throw err;

          const metadata = JSON.parse(data);
          console.log(metadata);
          // TODO: make this intelligent for any de-duping (ao3 vs. ffnet)
          metadata.chars.map((character) => {
            characters.add(character); // does de-duping
          });

          // ??: Can I not do this using the stories? Decoupling, right?
          metadata.fandoms.map((fandom) => {
            fandoms.add(fandom);
          });

          stories.push(metadata);
          console.log(stories);
        });
    });
  });

  //updateFFMeta();

  //setTimeout(updateFFMeta, 120000); // every 2 mins
  
  return { stories, characters, fandoms };
}

module.exports = Library;
