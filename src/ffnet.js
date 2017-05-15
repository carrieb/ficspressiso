const cheerio = require('cheerio');
const util = require('./util');
// must keep require's

let $;

const baseUrl = 'https://www.fanfiction.net';

const defaultQuery = '?&srt=1&lan=1&r=10&len=20'; // over 20k

const fandomToPathMap = {
  'Harry Potter': '/book/Harry-Potter/',
  'Star Wars': '/movie/Star-Wars/'
}

// initializations

const characterToQueryValue = {};

for (fandom in fandomToPathMap) {
  if (fandomToPathMap.hasOwnProperty(fandom)) {
    characterToQueryValue[fandom] = {};
  }
}

const loadCharactersForFandom = function(fandom, callback = () => {}) {
  const url = baseUrl + fandomToPathMap[fandom];
  if (Object.keys(characterToQueryValue[fandom]).length === 0) {
    util.download(url, (data) => {
      if (data) {
        var $ = cheerio.load(data);
        $('select[name="characterid1"] option').each(function(i, e){
            if ($(this).val() > 0) {
              characterToQueryValue[fandom][$(this).text()] = $(this).val();
            }
        });
        if (callback) {
          callback(characterToQueryValue[fandom]);
        }
      }
    });
  } else {
    callback(characterToQueryValue[fandom]);
  }
}

const getUrl = function(fandom, page, characters) {
  let url = baseUrl + fandomToPathMap[fandom] + defaultQuery + `&p=${page}`;
  if (characters.length > 0) {
    // TODO: multiple chars support
    const charId = characterToQueryValue[fandom][characters[0]];
    if (charId) {
      url += `&c1=${charId}`;
    }
  }
  return url;
}

var cleanCharName = function(str) {
  return str.replace(/\[|\]|\,/g, '').trim();
}

var findChars = function(str) {
  const chars = [];
  var raw_chars = str.replace(/\]/g, ',').split(', ');
  for (var raw_char in raw_chars) {
    if (raw_char !== "") {
      chars.push(cleanCharName(raw_chars[raw_char]));
    }
  }
  return chars;
}

const update_count = function(countString, metadata) {
    const [fieldName, fieldValue] = countString.split(':').map((s) => { return s.trim(); });
    switch(fieldName) {
      case "Rated":
        metadata.rating = fieldValue;
        break;
      case "Chapters":
        metadata.chapter_cnt = parseInt(fieldValue.replace(/,/g, ''));
        break;
      case "Words":
        metadata.word_cnt = parseInt(fieldValue.replace(/,/g, ''));
        break;
      case "Reviews":
        metadata.review_cnt = parseInt(fieldValue.replace(/,/g, ''));
        break;
      case "Favs":
        metadata.fav_cnt = parseInt(fieldValue.replace(/,/g, ''));
        break;
      case "Follows":
        metadata.follow_cnt = parseInt(fieldValue.replace(/,/g, ''));
        break;
      case "Status":
        metadata.status = fieldValue;
        break;
      case "Published":
        metadata.publish_date = fieldValue;
        break;
      case "Updated":
        metadata.update_date = fieldValue;
        break;
    }
}

const parseFields = function(fic) {
  const split = fic.raw_extra.split(' - ');
  for (const i in split) {
    const idx = parseInt(i);
    const item = split[idx].trim()
    if (item.indexOf(':') > -1) {
      update_count(item, fic)
    } else {
      if (item === "English") {
        continue; // don't care
      }
      if (item === "Complete") {
        fic.status = item;
        continue;
      }
      if (idx === split.length - 1 || idx === split.length - 2) {
        fic.characters = findChars(item);
      }
      else {
        // todo: genres
      }
    }
  }
}



const parseFicHtml = function(i, elem) {
  const fic = util.emptyFicObj();

  const titleEl = $(this).find('.stitle').first();
  fic.title = titleEl.text();
  fic.url = titleEl.attr('href');
  // TODO: extract id from url

  const authorEl = $(this).find('a[href^="/u"]').first();
  fic.author = authorEl.text();
  fic.author_url = authorEl.attr('href');

  fic.raw_extra = $(this).find('div.z-padtop2').first().text();
  fic.summary = $(this).find('div.z-padtop').first().contents().first().text();

  parseFields(fic);

  return fic;
}

const parseRawExtraHtml = (fic) => {
  const split = fic.raw_extra.split(' - ');
  //console.log(split);
  split.forEach((item, i) => {
    if (item.startsWith("Rated:")) {
      const ratingLink = item.replace("Rated: ", '');
      $ = cheerio.load(ratingLink);
      fic.rating = $('a').text();
      return;
    }

    if (item.startsWith("English")) {
      return;
    }

    if (item.startsWith("Words:")) {
      const words = parseInt(item.replace("Words: ", '').replace(',', ''));
      fic.word_cnt = words;
      return;
    }

    if (item.startsWith("Follows:")) {
      const follows = parseInt(item.replace("Follows: ", '').replace(',', ''));
      fic.follow_cnt = follows;
      return;
    }

    if (item.startsWith("Favs:")) {
      const favs = parseInt(item.replace("Favs: ", '').replace(',', ''));
      fic.fav_cnt = favs;
      return;
    }

    if (item.startsWith("Chapters:")) {
      const chapters = parseInt(item.replace("Chapters: ", ''));
      fic.chapter_cnt = chapters;
      return;
    }

    if (item.startsWith("Published:")) {
      const $ = cheerio.load(item.replace("Published: ", ''))
      fic.publish_date = $('span').text();
      fic.publish_ts = $('span').data('xutime');
      return;
    }

    if (item.startsWith("Updated: ")) {
      const $ = cheerio.load(item.replace("Updated: ", ''))
      fic.update_date = $('span').text();
      fic.update_ts = $('span').data('xutime');
      return;
    }

    if (item.startsWith("Status:")) {
      fic.status = item.replace("Status: ", '');
      if (fic.status === 'Complete') {
        fic.complete = true;
      }
      return;
    }

    if (i === 2 || i === 3) {
      fic.characters = findChars(item);
    }
  });
}

const parseStoryBlurb = (html) => {
  $ = cheerio.load(html);
  const fic = util.emptyFicObj();

  const profileTop = $('#profile_top');
  fic.title = profileTop.find('b').first().text()

  const authorEl = profileTop.find('a[href^="/u"]').first();
  fic.author = authorEl.text();
  fic.author_url = authorEl.attr('href');

  fic.summary = profileTop.find('div.xcontrast_txt').last().text();
  fic.raw_extra = profileTop.find('span.xcontrast_txt').last().html();

  parseRawExtraHtml(fic);

  return fic;
}

const storyIdUrlRegex = new RegExp('/s/([0-9]+)/');

const FFNet = {
  extractIdFromUrl(url) {
    const match = url.match(storyIdUrlRegex);
    if (match && match.length > 1) {
      return parseInt(match[1]);
    }
    return null;
  },

  retrieveFic(url, callback, notFound) {
    //console.log(url);
    try {
      util.download(url, (html) => {
        //console.log(html)
        if (html) {
          try {
            const ficData = parseStoryBlurb(html);
            ficData.url = url;
            ficData.id = this.extractIdFromUrl(url);

            //console.log(ficData);
            callback(ficData);
          } catch (e) {
            console.error(e);
            callback(null);
          }
        }
      });
    } catch (e) {
      console.log(e);
      callback(null);
    }
  },

  retrieveFics(page, fandom, characters, callback) {
    try {
      console.log(page, fandom, characters);
      result = [];

      loadCharactersForFandom(fandom);

      const url = getUrl(fandom, page, characters);
      console.log(url);

      util.download(url, (data) => {
        if (data) {
          $ = cheerio.load(data);
          $('.cimage').remove();
          const fics = $("div.z-list").map(parseFicHtml).get();

          console.log('Retrieved ' + fics.length + ' fics from ff.net for ' + fandom);
          callback(fics);
        } else {
          console.error(`Could not retrieve data for url ${url}`);
        }
      });
    } catch (e) {
      console.error(e);
    }
  },

  retrieveCharacters(fandom, callback) {
    loadCharactersForFandom(fandom, () => {
      callback(Object.keys(characterToQueryValue[fandom]));
    });
  }
}

module.exports = FFNet;
