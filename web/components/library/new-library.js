import React from 'react';

const initJson = window.initJson;
const stories = initJson.stories;

const NewLibrary = React.createClass({
  render() {
    const storyEls = stories.map((story, idx) => {
      // TODO: change story url to link to reader route
      return (
        <div className="item" key={idx}>
          <div className="content">
            <div className="header"><a href={story.url}>{story.title}</a> by <a href={story.author_url} target="_blank">{story.author}</a></div>
            <div className="meta">{story.fandoms.join('-')}</div>
            <div className="description">{story.summary}</div>
            <div className="extra">{story.chars.join(' - ')}</div>
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
