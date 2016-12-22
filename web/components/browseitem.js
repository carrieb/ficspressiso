import React from 'react';

import CharacterLabel from './library/character-label';

import uniqueId from 'lodash/uniqueId';

const BrowseItem = React.createClass({
  // props: fic, and highlight (arr of strings)
  // TODO: do highlighting
  render() {
    const fic = this.props.fic
    const cacheBust = new Date().getTime();
    const charLabels = fic.characters.map((char) => {
      return (
        <CharacterLabel character={char} key={uniqueId()}/>
      );
    });
    return(<div className="item">
      <div className="image">
        <img src={ "https://unsplash.it/200/200/?random=" + cacheBust }/>
      </div>
      <div className="middle aligned content browse_item_content">
        <a className="header" style={{ fontSize: '2 rem' }} href={"https://www.fanfiction.net" + fic.url } className="header">{ fic.title }</a>
        <div className="meta"><span>{ fic.author }</span></div>
        <div className="description"><p>{ fic.summary }</p></div>
        <div className="extra">
          <div className="ui basic violet label"><i className="tasks icon"></i>{fic.word_cnt}</div>
          <div className="ui basic teal label"><i className="book icon"></i>{fic.chapter_cnt}</div>
          <div className="ui basic blue label"><i className="thumbs up icon"></i>{fic.fav_cnt}</div>
          <div className="ui basic red label"><i className="heart icon"></i>{fic.follow_cnt}</div>
          <div className="ui basic olive label"><i className="comment icon"></i>{fic.review_cnt}</div>
          <div>
            {charLabels}
          </div>
        </div>
      </div>
    </div>);
  }
});

module.exports = BrowseItem
