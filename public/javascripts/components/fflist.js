import React from 'react';
import FFItem from './ffitem';
import FFFilter from './fffilter';

const initJson = window.initJson;
const stories = initJson.stories;

var FFList = React.createClass({
  propTypes: {
    currentFic: React.PropTypes.string,
    loadFicContent: React.PropTypes.func,
    query: React.PropTypes.object
  },

  storiesForQuery() {
    const query = this.props.query;
    return stories.filter((story) => {
      let matchesQuery = true;
      if (query.fandom) {
        matchesQuery = matchesQuery && (query.fandom === story.fandom);
      }
      if (query.character) {
        matchesQuery = matchesQuery && (story.chars.indexOf(query.character) > -1);
      }
      return matchesQuery;
    })
  },

  render() {
    var rows = this.storiesForQuery().map((story, idx) => {
      const selected = this.props.currentFic ? this.props.currentFic.title === story.title : false;
      return (
        <FFItem data={story} key={idx} loadFicContent={this.props.loadFicContent} selected={selected}/>
      );
    });
    return (
      <div className="fic_list">
        { rows }
      </div>
    );
  }
});

module.exports = FFList
