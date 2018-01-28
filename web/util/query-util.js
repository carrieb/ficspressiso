import QueryString from 'query-string';

import _clone from 'lodash/clone';

const QueryUtil = {
  DEFAULT_CHART_QUERY: {
    characters: ['Hermione G.', 'Harry P.', 'Ginny W.', 'Ron W.'],
    start: '2001-01-01',
    end: '2017-12-31',
    rating: [],
    minWords: 0,
    maxWords: 100000000, // ten million
    sites: ['fanfiction.net']
  },

  DEFAULT_BROWSE_QUERY: {
    page: 1,
    characters: [],
    fandom: 'Harry Potter',
    sites: ['fanfiction.net']
  },

  DEFAULT_TOP_QUERY: {
      characters: [],
      start: '2001-01-01',
      end: '2017-12-31',
      minWords: 0,
      maxWords: 10000000, // ten million
      rating: [],
      sites: ['fanfiction.net']
  },

  browseQueryFromLocation(location) {
    const raw = location.search;
    const parsed = QueryString.parse(raw);
    const browseQuery = _clone(this.DEFAULT_BROWSE_QUERY);
    Object.keys(parsed).forEach((key) => {
      if (key === 'p') {
        browseQuery.page = parseInt(parsed[key]);
      }
    });
    return browseQuery;
  }
};

export default QueryUtil;