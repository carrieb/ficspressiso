import React from 'react';
import PropTypes from 'prop-types';

import CharacterLabel from 'components/common/character-label';
import FicSettingsButton from 'components/common/fic-settings-button';

class FicBlob extends React.Component {
  render() {
    const fic = this.props.fic;
    const authorUrl = `https://www.fanfiction.net${fic.author_url}`;
    const characterLabels = fic.characters.map((character) =>
      <CharacterLabel key={`${fic._id}_${character}`} character={character}/>
    );
    const tagLabels = fic.tags ? fic.tags.map((tag) => {
      return (<a className="ui label visible" style={{ display: 'inline-block !important' }}>
        { tag }
        <i className="delete icon"></i>
      </a>)
    }) : null;
    const addTag = (
      <a className="ui icon label add-tag" style={{ display: 'inline-block !important' }}>
        <i className="plus icon"></i>
      </a>
    );

    return (
      <div className="fic-blob">
        <p><b>by <a href={authorUrl}>{ fic.author }</a></b></p>
        <p>{fic.rating}</p>
        <p className="summary">{ fic.summary }</p>
        <div className="characters">{ characterLabels }</div>
        <div className="tags">
          <div className="ui transparent input">
            { addTag } { tagLabels }
          </div>
        </div>
        <div className="dates">
          <b>{fic.word_cnt}</b> <span className="left-padded">{fic.publish_date} - {fic.update_date}</span>
        </div>
        <div>
          <FicSettingsButton reindex={(cb) => this.props.reindex(cb) }/>
          <a className="ui green button" href={fic.url} target="_blank">GO</a>
        </div>
      </div>
    );
  }
}

FicBlob.propTypes = {
  fic: PropTypes.object.isRequired
}

export default FicBlob;
