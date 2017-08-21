import React from 'react';

import { NavLink } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <div className="ui container">
        <div className="ui teal large secondary pointing menu">
          <NavLink to="/library" activeClassName="active" className="ui item">Library</NavLink>
          <NavLink to="/browse" activeClassName="active" className="ui item">Browse</NavLink>
          <NavLink to="/chart" activeClassName="active" className="ui item">Chart</NavLink>
          <NavLink to="/top" activeClassName="active" className="ui item">Top</NavLink>
          <div className="right menu">
            <NavLink to="/settings" activeClassName="active" className="ui item">Settings</NavLink>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
