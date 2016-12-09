import React from 'react';

import { Link } from 'react-router';

var App = React.createClass({
  render() {
    return (<div>
      <div className="ui teal large secondary pointing menu" style={{ marginBottom: '20px' }}>
        <Link to="/library" activeClassName="active" className="ui item">Library</Link>
        <Link to="/browse" activeClassName="active" className="ui item">Browse</Link>
        <Link to="/chart" activeClassName="active" className="ui item">Chart</Link>
        <div className="right menu">
          <Link to="/settings" activeClassName="active" className="ui item">Settings</Link>
        </div>
      </div>
      { this.props.children }
    </div>);
  }
});

module.exports = App;
