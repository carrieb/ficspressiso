const cheerio = require('cheerio');

const util = require('./util');

const baseUrl = 'https://www.fanfiction.net';

const defaultQuery = '?&srt=1&lan=1&r=10';

const fandomToPathMap = {
  'Harry Potter': '/book/Harry-Potter/'
}

const characterToQueryValue = {};

const loadCharactersForFandom = function(fandom) {
  const url = baseUrl + fandomToPathMap[fandom];
  util.download(url, (data) => {
    if (data) {
      var $ = cheerio.load(data);
      $('select[name="characterid1"] option').each(function(i, e){
          if ($(this).val() > 0) {
            characterToQueryValue[$(this).text()] = $(this).val();
          }
      });
    }
  });
}

const getUrl = function(fandom, page, character) {
  let url = baseUrl + fandomToPathMap[fandom] + defaultQuery + `&p=${page}`;
  if (character) {
    const charId = characterToQueryValue[character];
    if (charId) {
      url += `&c1=${charId}`;
    }
  }
  return url;
}

var cleanCharName = function(str) {
  return str.replace('[', '').replace(']', '').trim();
}

var findChars = function(str) {
  var items = str.split(' - ');
  var last = items[items.length -1];
  var chars = [];
  if (last === 'Complete') {

  } else {
    if (!last.startsWith('Published:')) {
      var raw_chars = last.split(', ');
      for (var raw_char in raw_chars) {
        chars.push(cleanCharName(raw_chars[raw_char]));
      }
    }
  }
  return chars;
}

const update_count = function(countString, metadata) {
    // Special case rating
    const [fieldName, fieldValue] = countString.split(':').map((s) => { return s.trim(); });
    console.log(fieldName, fieldValue);
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
  const split = fic.extra.split(' - ');
  for (const idx in split) {
    const item = split[idx].trim()
    if (item.indexOf(':') > -1) {
      update_count(item, fic)
    } else {
      if (item === "English") {
        continue;
      }
      if (item === "Complete") {
        continue;
      }
      else {
        // todo:
      }
    }
  }
}

const FFNet = {
  retrieveFics(page, fandom, character, callback) {
    console.log(page, fandom, character);
    browse_data = [];
    // TODO: decide a better place to do this
    loadCharactersForFandom(fandom);
    const url = getUrl(fandom, page, character);
    console.log(url);
    util.download(url, (data) => {
      if (data) {
        var $ = cheerio.load(data);
        $('.cimage').remove();
        $("div.z-list").each(function(i, e) {
          //list = list + $(this).addClass('item').css('width', '100%');
          var title = $(this).find('.stitle').first().text();
          var url = $(this).find('.stitle').first().attr('href');
          var author = $(this).find('a[href^="/u/"]').first().text();
          var extra = $(this).find('div.z-padtop2').first().text();
          var summary = $(this).find('div.z-padtop').first().contents().first().text();
          var characters = findChars(extra);
          var fic = { title, url, author, extra, summary, characters };
          parseFields(fic);
          console.log(fic);
          browse_data.push(fic);
        });
        console.log('Retrieved ' + browse_data.length + ' fics from ff.net');
        callback(browse_data);
      } else {
        console.error(`Could not retrieve data for url ${url}`);
      }
    });
  }
}

module.exports = FFNet;
