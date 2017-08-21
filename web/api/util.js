const get = function(url, data, log=true) {
  return $.ajax(url, {
    type: 'GET',
    data
  }).then((res) => {
    if (log) console.log(url, data, res);
    return res;
  });
};

const ApiUtils = {
  browseFics: function({
    page = 1,
    characters = [],
    fandom = "Harry Potter"
  } = {}) {
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
    }, false);
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
