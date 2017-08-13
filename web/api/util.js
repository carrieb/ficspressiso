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

  getChartData(query) {
    return get('/api/chart/data', query);
  },

  // TODO: pass params
  getTopData(query, sort, page) {
    console.log(query, sort, page);
    const data = query;
    data.sort = sort;
    data.page = page;
    data.limit = 10;
    return get('/api/top/data', data);
  },

  reindex(url) {
    return get('/api/reindex', {
      url: url
    });
  },

  getTimeline(id) {
    return get('/api/fic/timeline', {
      id
    });
  }
};

export default ApiUtils;
