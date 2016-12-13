import React from 'react';

const initJson = window.initJson;
const stories = initJson.stories;

const NewLibrary = React.createClass({
  render() {
    const storyEls = stories.map((story) => {
      return (
        <div className="item">
          <div className="content">
            <div className="header">{story.title}</div>
            <div className="meta"></div>
            <div className="description">{story.summary}</div>
            <div className="extra"></div>
          </div>
        </div>
      );
    });
    return (
      <div className="container">
        <div className="ui items">
          {storyEls}
        </div>
      </div>
    );
  }
});

export default NewLibrary;
