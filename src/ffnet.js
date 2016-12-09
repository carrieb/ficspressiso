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
