const get = function(url, data) {
  return $.ajax(url, {
    type: 'GET',
    data
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
  getTopData(characters, start, end, limit, sort) {
    return get('/api/top/data', {
      characters,
      start,
      end,
      limit,
      sort
    });
  }
}

export default ApiUtils;
