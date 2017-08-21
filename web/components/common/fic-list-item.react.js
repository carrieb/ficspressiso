import React from 'react';
import PropTypes from 'prop-types';

import CharacterLabel from 'components/library/character-label';


class FicListItem extends React.Component {
  render() {
    const fic = this.props.fic;
    const characterLabels = fic.characters.map((char, idx) => {
      return (
        <CharacterLabel character={char}
                        key={idx}/>
      );
    });
    return (
      <div className="item fic-list-item">
        <div className="middle aligned content">
          <a className="header"
             target="_blank"
             href={ fic.url }>{ fic.title }</a>
          <div className="meta"><span>{ fic.author }</span></div>
          <div className="description"><p>{ fic.summary }</p></div>
          <div>
            <div className="statistics">
              <div className="right floated">
                <div className="ui basic blue label">
                  <i className="thumbs up icon"/>
                  {fic.fav_cnt.toLocaleString()}
                </div>
                <div className="ui basic red label">
                  <i className="heart icon"/>
                  {fic.follow_cnt.toLocaleString()}
                </div>
                <div className="ui basic olive label">
                  <i className="comment icon"/>
                  {fic.review_cnt.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="ui basic violet label">
                  <i className="tasks icon"/>
                  {fic.word_cnt.toLocaleString()}
                </div>
                <div className="ui basic teal label">
                  <i className="book icon"/>
                  {fic.chapter_cnt.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="right floated right aligned"
                 style={{ fontSize: '.75rem' }}>
              Updated: {fic.update_date}<br/>
              Published: {fic.publish_date}
            </div>
            <div>{characterLabels}</div>
          </div>
        </div>
      </div>
    );
  }
}

FicListItem.propTypes = {
  fic: PropTypes.object.isRequired
};

export default FicListItem;