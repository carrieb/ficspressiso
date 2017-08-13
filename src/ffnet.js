const cheerio = require('cheerio');
const util = require('./util');
// must keep require's

let $;

const baseUrl = 'https://www.fanfiction.net';

const defaultQuery = '?&srt=1&lan=1&r=10&len=20'; // over 20k

const fandomToPath = {
  'Harry Potter': '/book/Harry-Potter/',
  'Star Wars': '/movie/Star-Wars/'
};

// initializations

const characterToQueryValue = {};

for (fandom in fandomToPath) {
  if (fandomToPath.hasOwnProperty(fandom)) {
    characterToQueryValue[fandom] = {};
  }
}

const loadCharactersForFandom = function(fandom, callback = () => {}) {
  const url = baseUrl + fandomToPath[fandom];
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
};

const getUrl = function(fandom, page, characters) {
  let url = baseUrl + fandomToPath[fandom] + defaultQuery + `&p=${page}`;
  if (characters.length > 0) {
    // TODO: multiple chars support
    const charId = characterToQueryValue[fandom][characters[0]];
    if (charId) {
      url += `&c1=${charId}`;
    }
  }
  return url;
};

var cleanCharName = function(str) {
  return str.replace(/\[|\]|\,/g, '').trim();
};

var findChars = function(str) {
  const chars = [];
  var raw_chars = str.replace(/\]/g, ',').split(', ');
  for (var raw_char in raw_chars) {
    if (raw_char !== "") {
      chars.push(cleanCharName(raw_chars[raw_char]));
    }
  }
  return chars;
};

const idRegex = new RegExp('\/s\/([0-9]+)\/');

const parseFicHtml = function(i, elem) {
  const fic = util.emptyFicObj();

  const titleEl = $(this).find('.stitle').first();
  fic.title = titleEl.text();
  fic.url = 'https://www.fanfiction.net' + titleEl.attr('href');
  const idMatch = idRegex.exec(fic.url);
  if (idMatch) {
    const id = parseInt(idMatch[1]);
    fic.id = id;
  } else {
    console.error(idRegex, fic.url);
  }


  const authorEl = $(this).find('a[href^="/u"]').first();
  fic.author = authorEl.text();
  fic.author_url = 'https://www.fanfiction.net' + authorEl.attr('href');

  fic.raw_extra = $(this).find('div.z-padtop2').first().html();
  fic.summary = $(this).find('div.z-padtop').first().contents().first().text();

  parseRawExtraHtml(fic, true);

  return fic;
};

const parseRawExtraHtml = (fic, charactersLast=false) => {
  const split = fic.raw_extra.split(' - ');
  split.forEach((item, i) => {
    if (item.startsWith("Rated:")) {
      const ratingLink = item.replace("Rated: ", '');
      if (ratingLink.startsWith("<")) {
          $ = cheerio.load(ratingLink);
          fic.rating = $('a').text();
          return;
      } else {
        fic.rating = ratingLink;
        return;
      }
    }

    if (item.startsWith("English")) {
      return;
    }

    if (item.startsWith("Words:")) {
      const words = parseInt(item.replace("Words: ", '').replace(',', ''));
      fic.word_cnt = words;
      return;
    }

    if (item.startsWith("Reviews:")) {
        const reviews = parseInt(item.replace("Reviews: ", '').replace(',', ''));
        fic.review_cnt = reviews;
        return
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

    if ((i === 2 || i === 3) && !charactersLast) {
      fic.characters = findChars(item);
    }

    if (charactersLast && i === split.length - 1 && !(item === 'Complete' || item === 'Abandoned')) {
      fic.characters = findChars(item);
    }
  });
};

const parseStoryBlurb = (html) => {
  $ = cheerio.load(html);
  const fic = util.emptyFicObj();

  const profileTop = $('#profile_top');
  fic.title = profileTop.find('b').first().text();

  const authorEl = profileTop.find('a[href^="/u"]').first();
  fic.author = authorEl.text();
  fic.author_url = authorEl.attr('href');

  fic.summary = profileTop.find('div.xcontrast_txt').last().text();
  fic.raw_extra = profileTop.find('span.xcontrast_txt').last().html();

  parseRawExtraHtml(fic);

  return fic;
};

const parseReviewHtml = function(i, elem) {
  const review = {};

  const dateEl = $(this).find('span[data-xutime]').first();
  const ts = parseInt(dateEl.attr('data-xutime'));
  review.ts = ts;
  review.date = dateEl.text();
  review.sentiment = 'todo';
  review.author = 'todo';

  return review;
};

const storyIdUrlRegex = new RegExp('\/s\/([0-9]+)\/');

const FFNet = {
  extractIdFromUrl(url) {
    const match = url.match(storyIdUrlRegex);
    if (match && match.length > 1) {
      return parseInt(match[1]);
    }
    return null;
  },

  retrieveFic(url, callback, notFound) {
    try {
      util.download(url, (html) => {
        if (html) {
          try {
            const ficData = parseStoryBlurb(html);
            ficData.url = url;
            ficData.id = this.extractIdFromUrl(url);

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

  parseReviews(url, callback) {
    util.download(url, (data) => {
      if (data) {
        $ = cheerio.load(data);
        const reviews = $('td').map(parseReviewHtml).get();
        callback(reviews);
      }
    });
  },

  retrieveFics(page, fandom, characters, callback) {
    try {
      result = [];

      loadCharactersForFandom(fandom);

      const url = getUrl(fandom, page, characters);

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
};

module.exports = FFNet;
