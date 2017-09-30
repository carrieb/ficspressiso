import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Redirect } from 'react-router';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

import Nav from 'components/nav.react';
import Browse from 'components/browse.react';
import Chart from 'components/chart.react';
import Library from 'components/library/library.react';
import ApiTopList from 'components/top/api-top-list';

if (typeof window !== 'undefined') {
  window.onload = function() {
    console.log('initJson', window.initJson);
    const router = (
      <Router history={history}>
        <div>
          <Nav/>
          <Route exact path="/" render={() => <Redirect to="/library"/>}/>
          <Route path="/library" component={Library}/>
          <Route path="/browse" component={Browse}/>
          <Route path="/chart" component={Chart}/>
          <Route path="/top" component={ApiTopList}/>
        </div>
      </Router>
    );

    render(router, document.getElementById("content"));
  };
}
