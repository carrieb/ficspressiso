const works = $('.work.blurb');

const fics = [];

works.each(function( index ) {
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
});

console.log(fics);

// TODO: popup a dialog asking to crawl
// TODO: upload these to the db automatically

chrome.runtime.sendMessage({ messageType: 'UPLOAD_AO3_CRAWL', fics }, (response) => {
  console.log(response.result);
  const res = response.result;

  if (response.error) {
    console.error(response.error);
    return;
  }

  if (res.isCrawling) {
    setTimeout(() => {
      window.location.href = window.location.origin + window.location.pathname + `?page=${res.crawlPage+1}`;
    }, 1500);
  } else {
    // show crawl options

    const crawlDiv = document.createElement('div');
    crawlDiv.classList.add('crawl-div');

    const crawlButton = document.createElement('button');
    crawlButton.textContent = 'Crawl';
    crawlButton.onclick = function(ev) {
      ev.preventDefault();

      console.log(window.location.origin + window.location.pathname);
      window.location.href = window.location.origin + window.location.pathname + '?page=2';

      chrome.runtime.sendMessage({ messageType: 'AOE_CRAWL_START' }, (response) => {
        console.log(response.result || response.error);
      });
    }
    crawlDiv.appendChild(crawlButton);

    const paginator = $('ol.pagination').first();
    paginator.after(crawlDiv);
  }
});
