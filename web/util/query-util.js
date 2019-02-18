import QueryString from 'query-string';
import moment from 'moment';

import _clone from 'lodash/clone';

const today = moment().format('YYYY-MM-DD');

const QueryUtil = {
  DEFAULT_CHART_QUERY: {
    characters: ['Hermione G.', 'Harry P.', 'Ginny W.', 'Ron W.'],
    start: '2017-01-01',
    end: today,
    rating: [],
    minWords: 0,
    maxWords: 100000000, // ten million
    sites: ['fanfiction.net'],
    fandoms: ['Harry Potter']
  },

  DEFAULT_BROWSE_QUERY: {
    page: 1,
    characters: [],
    fandoms: ['Harry Potter'],
    sites: ['fanfiction.net']
  },

  DEFAULT_TOP_QUERY: {
      characters: [],
      start: '2001-01-01',
      end: moment().format('YYYY-MM-DD'),
      minWords: 0,
      maxWords: 10000000, // ten million
      rating: [],
      sites: ['fanfiction.net']
  },

  DEFAULT_EMPTY_QUERY: {
      characters: [],
      start: '',
      end: '',
      rating: [],
      minWords: 0,
      maxWords: 100000000, // ten million
      sites: [],
      fandoms: []
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
