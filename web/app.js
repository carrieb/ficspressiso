import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Redirect } from 'react-router';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

import AppNav from './components/app-nav.react';
import Browse from './components/browse.react';
import Chart from './components/chart.react';
import NewLibrary from './components/library/new-library';
import ApiTopList from './components/top/api-top-list';

if (typeof window !== "undefined") {
  window.onload = function() {
    console.log('initJson', window.initJson);
    render(
      <Router history={history}>
        <div>
          <AppNav/>
          <Route exact path="/" render={() => <Redirect to="/library"/>}/>
          <Route path="/library" component={NewLibrary}/>
          <Route path="/browse" component={Browse}/>
          <Route path="/chart" component={Chart}/>
          <Route path="/top" component={ApiTopList}/>
        </div>
      </Router>,
      document.getElementById("content")
    );
  };
}
