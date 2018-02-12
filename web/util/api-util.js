const get = function(url, data = {}, log=true) {
    return $.ajax(url, {
        type: 'GET',
        data,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8'
    })
        .then((res) => {
            if (log) {
                console.log(url, data, res);
            }
            return res;
        });
};

const post = function(url, data = {}, log=true) {
  console.log(data);
  return $.ajax(url, {
      type: 'POST',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8'
    })
      .then((res) => {
        if (log) {
          console.log(url, data, res);
        }
        return res;
      });
};

const ApiUtils = {
    browseFics(query) {
        return post('/api/browse', query);
    },

    getFandoms() {
        return get('/api/fandoms');
    },

    getCharacters({
                      fandom = "Harry Potter"
                  } = {}) {
        return get('/api/characters', {
            fandom
        });;
    },

    downloadFic({
        site = 'ao3',
        id = '29873247'
    }) {
       return  $.ajax('/api/download', {
           data: JSON.stringify({ site, id }),
           type: 'GET',
           xhrFields: {
               onprogress: (e) => {
                   console.log(e.currentTarget.response);
               }
           }
       })
    },

    getLibrary() {
      return get('/api/library');
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
