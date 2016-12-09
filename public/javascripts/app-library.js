import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

const App = React.createClass({
  render() {
    return (<div><Link to="/library/about">About</Link>'App'{children}</div>);
  }
});

const About = React.createClass({ render() { console.log(this.props); return (<div>'About'<Link to="/library/about">About</Link></div>); } });
const NoMatch = React.createClass({ render() { return (<div>'No Match'</div>); } });

// Declarative route configuration (could also load this config lazily
// instead, all you really need is a single root route, you don't need to
// colocate the entire config).
render((
  <Router history={browserHistory}>
    <Route path="/library" component={App}>
      <Route path="/library/about" component={About}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('content'))
