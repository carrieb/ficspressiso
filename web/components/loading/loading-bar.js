import React from 'react';

const LoadingBar = React.createClass({
  render() {
    return (
      <div className="ui segment" style={{ border: 'none', boxShadow: 'none'}}>
        <div className="ui active inverted dimmer">
          <div className="ui medium text loader">Loading</div>
        </div>
        <p>hihihihi</p>
        <p>hihihihi</p>
        <p>hihihihi</p>
      </div>
    );
  }
});

export default LoadingBar;
