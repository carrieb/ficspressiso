const get = function(url, data, log=true) {
  return $.ajax(url, {
    type: 'GET',
    timeout: 7000,
    data
  }).then((res) => {
    if (log) console.log(url, data, res);
    return res;
  });
};

const ApiUtils = {
  browseFics: function(query) {
    console.log(query);
    return get('/api/browse', query);
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
