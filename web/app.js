import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRedirect } from 'react-router';

import App from './components/app';
import Library from './components/library';
import Browse from './components/browse';
import Chart from './components/chartapp';
import NewLibrary from './components/library/new-library';

if (typeof window !== "undefined") {
  window.onload = function() {
    console.log(window.initJson);
    render(<Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRedirect to="/library" />
          <Route path="/library" component={Library}/>
          <Route path="/new-library" component={NewLibrary}/>
          <Route path="/browse" component={Browse}/>
          <Route path="/chart" component={Chart}/>
        </Route>
      </Router>, document.getElementById("content"));
  };
}