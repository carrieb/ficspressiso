import React from 'react';
import FFItem from './ffitem';
import FFFilter from './fffilter';

const initJson = window.initJson;
const stories = initJson.stories;

var FFList = React.createClass({
  render() {
    var rows = stories.map((story, idx) => {
      const selected = this.props.currentFic ? this.props.currentFic.title === this.props.meta[i].title : false;
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
