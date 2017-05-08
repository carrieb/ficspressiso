import React from 'react';

import CharacterLabel from 'components/common/character-label';
import FicSettingsButton from 'components/common/fic-settings-button';

const TopList = React.createClass({
  propTypes: {
      items: React.PropTypes.array.isRequired
  },

  render() {
    let accordionContent = []
    this.props.items.forEach((fic) => {
      accordionContent.push(
        <div className="title" key={`${fic._id}_title`}>
          {fic.title}<span style={{ float: 'right'}}>{fic.fav_cnt}</span>
        </div>
      );
      let characterLabels = fic.characters.map((character) =>
        <CharacterLabel key={`${fic._id}_${character}`} character={character}/>
      );
      accordionContent.push(
        <div className="content" key={`${fic._id}_content`}>
          {characterLabels} <b>{fic.word_cnt}</b>
          <FicSettingsButton/>
          <a className="ui green button" href={fic.url} target="_blank" style={{ float: 'right' }}>GO</a>
        </div>
      );
    });
    return (
      <div className="top-list fic-list ui fluid styled accordion">
        { accordionContent }
      </div>
    )
  }
});

export default TopList;
