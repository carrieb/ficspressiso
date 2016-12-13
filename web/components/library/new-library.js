import React from 'react';

import NewFilter from '../filter/new-filter';

const initJson = window.initJson;
const stories = initJson.stories;
const characters = initJson.characters;
const fandoms = initJson.fandoms;

const labelize = (item) => {
  return (
    <div className="ui basic label">{item}</div>
  );
}

const NewLibrary = React.createClass({
  getInitialState() {
    return {
      query: {}
    };
  },

  storiesForQuery() {
    const query = this.state.query;
    return stories.filter((story) => {
      let matchesQuery = true;
      if (query.fandoms) {
        matchesQuery = matchesQuery && (query.fandoms === story.fandom);
      }
      if (query.characters) {
        matchesQuery = matchesQuery && (story.chars.indexOf(query.characters) > -1);
      }
      return matchesQuery;
    });
  },

  render() {
    console.log(this.state.query);
    const storyEls = this.storiesForQuery().map((story, idx) => {
      // TODO: change story url to link to reader route
      return (
        <div className="item" key={idx}>
          <div className="content">
            <div className="header"><a href={story.url}>{story.title}</a> by <a href={story.author_url} target="_blank">{story.author}</a></div>
            <div className="meta">{story.fandoms.join('-')}</div>
            <div className="description">{story.summary}</div>
            <div className="extra">
              {story.chars.map(labelize)}
              <div className="ui basic violet label"><i className="tasks icon"></i>{story.word_cnt}</div>
              <div className="ui basic teal label"><i className="book icon"></i>{story.chapter_cnt}</div>
              <div className="ui basic blue label"><i className="thumbs up icon"></i>{story.fav_cnt}</div>
              <div className="ui basic red label"><i className="heart icon"></i>{story.follow_cnt}</div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="container">
        <NewFilter updateFilterQuery={(query) => { this.setState({query}); }} options={{fandoms, characters}}/>
        <div className="ui items">
          {storyEls}
        </div>
      </div>
    );
  }
});

export default NewLibrary;
