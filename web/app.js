import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRedirect } from 'react-router';

import App from './components/app';
import Library from './components/library';
import Browse from './components/browse';
import NewChart from './components/chart/new-chart';
import NewLibrary from './components/library/new-library';
import ApiTopList from './components/top/api-top-list';

if (typeof window !== "undefined") {
  window.onload = function() {
    console.log(window.initJson);
    render(<Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRedirect to="/library" />
          <Route path="/library" component={Library}/>
          <Route path="/new-library" component={NewLibrary}/>
          <Route path="/browse" component={Browse}/>
          <Route path="/chart" component={NewChart}/>
          <Route path="/top" component={ApiTopList}/>
        </Route>
      </Router>, document.getElementById("content"));
  };
}
