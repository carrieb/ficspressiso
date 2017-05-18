const get = function(url, data) {
  return $.ajax(url, {
    type: 'GET',
    data
  }).then((res) => {
    console.log(url, res);
    return res;
  });
}

const ApiUtils = {
  browseFics: function({
    page = 1,
    characters = [],
    fandom = "Harry Potter"
  } = {}) {
    console.log('api call', page, characters);
    return get('/api/browse', {
      page,
      characters,
      fandom
    });
  },

  getCharacters({
    fandom = "Harry Potter"
  } = {}) {
    return get('/api/characters', {
      fandom
    });
  },

  getChartData({
    characters = [],
    start = null,
    end = null
  } = {}) {
    return get('/api/chart/data', {
      characters,
      start,
      end
    });
  },

  // TODO: pass params
  getTopData(characters, start, end, limit, minWords, maxWords, sort, page) {
    console.log(characters, start, end, limit, minWords, maxWords, sort, page)
    return get('/api/top/data', {
      characters,
      start,
      end,
      limit,
      minWords,
      maxWords,
      sort,
      page
    });
  },

  reindex(url) {
    return get('/api/reindex', {
      url: url
    });
  }
}

export default ApiUtils;
