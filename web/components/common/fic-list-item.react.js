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

          <div className="header">
            <a className="title"
               target="_blank"
               href={ fic.url }>{ fic.title }</a>
            <span className="right">
              <a target="_blank" href={fic.author_url}>{ fic.author }</a>
            </span>
            <div className="icons">
              <i className="erase icon"/>
              <i className="download icon"/>
            </div>

          </div>

          <div className="five mini ui basic buttons">
            <div className="ui button">
              <i className="feed icon"/>
              {fic.follow_cnt.toLocaleString()}
            </div>
            <div className="ui button">
              <i className="heart icon"/>
              {fic.fav_cnt.toLocaleString()}
            </div>
            <div className="ui button">
              <i className="comment icon"/>
              {fic.review_cnt.toLocaleString()}
            </div>
            <div className="ui button">
              <i className="paragraph icon"/>
              {fic.word_cnt.toLocaleString()}
            </div>
            <div className="ui button">
              <i className="file text outline icon"/>
              {fic.chapter_cnt.toLocaleString()}
            </div>
          </div>

          <div className="description">
            { fic.summary }
          </div>
          <div className="footer">
            <div className="right">
              Updated: {fic.update_date}<br/>
              Published: {fic.publish_date}
            </div>
            <div className="characters">
              { characterLabels }
            </div>
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