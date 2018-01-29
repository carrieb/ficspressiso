const util = require('./util');
const cheerio = require('cheerio');

let $;

const fics = [];

// TODO: this is tricky for ao3.
// the filters only return like 10 names by default
// and the fandoms have huge indices
// TBH, the best bet is to probably scrape these and store in an
// internal site meta db
const characterIdMap = {};
const relationshipIdMap = {};

const processWork = function(index) {
    const work = $(this);

    const titleLink = work.find('.header a[href^="/works/"]');
    const title = titleLink.text();
    const url = titleLink.attr('href');

    const idRegex = /\/works\/(\d+)/g;
    const match = idRegex.exec(url);
    const id = parseInt(match[1]);

    const authorLink = work.find('a[rel="author"]');
    const author = authorLink.text();
    const authorUrl = authorLink.attr('href');

    const fandomLinks = work.find('.fandoms a[href^="/tags/"]');
    const fandoms = fandomLinks.map(function() {
        return $(this).text();
    }).get();

    const rating = work.find('.rating .text').text().trim();

    const summary = work.find('.summary').text().trim();

    const getNumeric = (className) => {
        const field = work.find(`dd.${className}`);
        if (field.length > 0) {
            return parseInt(field.text().replace(/,/g, ''));
        } else {
            return 0;
        }
    }

    const words = getNumeric('words');
    const comments = getNumeric('comments');
    const kudos = getNumeric('kudos');
    const hits = getNumeric('hits');
    const bookmarks = getNumeric('bookmarks');

    const chaptersStr = work.find('dd.chapters').text();
    const split = chaptersStr.split('/').map((str) => str.trim())
    const current = parseInt(split[0].trim());
    const forecastTotal = split[1] === '?' ? null : parseInt(split[1]);

    const relationshipEls = work.find('.relationships');
    const relationships = relationshipEls.map(function() {
        return $(this).find('a.tag').text();
    }).get();

    const characterEls = work.find('.characters');
    const characters = characterEls.map(function() {
        return $(this).find('a.tag').text();
    }).get();

    const updated = work.find('.datetime').text();

    const fic = {
        id,
        title,
        url: 'https://archiveofourown.org' + url,
        author,
        authorUrl: 'https://archiveofourown.org' + authorUrl,
        site: 'https://archiveofourown.org',

        updated,

        fandoms,
        rating,

        summary,

        words,
        comments,
        kudos,
        hits,
        bookmarks,

        chapters: current,
        chapterForecast: forecastTotal,

        characters,
        relationships
    }

    //console.log(fic);
    fics.push(fic);
};

const getUrl = ({ page, fandoms, characters, relationships, rating, sort='revised_at' }) => {
    const baseUrl = 'https://archiveofourown.org/works?';
    // TODO: map relationships to ids
    const fandom = 'Star Wars Episode VII: The Force Awakens (2015)'; // fandoms[0];
    const query = {
        work_search: {
            sort_column: sort,
            relationship_ids: [7266959], // reylo
            language_id: 1, // english
            complete: 0, // incomplete
            tag_id: fandom
        }
    };

    let queryString = '';
    Object.keys(query.work_search).forEach((key) => {
       const value = query.work_search[key];
       const str = value.isArray ?
           `[]=${value.join(',')}` :
           '=${value}';
       queryString += encodeURIComponent(`work_search[${key}]${str}&`);
    });

    console.log(baseUrl + queryString);
    return baseUrl + queryString;
};

const AO3 = {
    retrieveFics(query, callback) {
        try {
            const url = getUrl(query);

            util.download(url, (data) => {
                if (data) {
                    $ = cheerio.load(data);

                    const works = $('.work.blurb');
                    works.forEach(processWork);

                    console.log('Retrieved ' + fics.length + ' fics from ao3.org for ' + query.fandom);
                    callback(fics);
                } else {
                    console.error(`Could not retrieve data for url ${url}`);
                }
            });
        } catch (e) {
            console.error(e);
        }
    }
};

module.exports = AO3;