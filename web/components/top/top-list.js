import React from 'react';

import CharacterLabel from 'components/common/character-label';
import FicSettingsButton from 'components/common/fic-settings-button';

import ApiUtil from 'api/util';

const TopList = React.createClass({
  propTypes: {
      items: React.PropTypes.array.isRequired,
      update: React.PropTypes.func.isRequired
  },

  render() {
    let accordionContent = []
    this.props.items.forEach((fic, i) => {
      accordionContent.push(
        <div className="title" key={`${fic._id}_title`}>
          {fic.title}<span style={{ float: 'right'}}>{fic.fav_cnt}</span>
        </div>
      );
      let characterLabels = fic.characters.map((character) =>
        <CharacterLabel key={`${fic._id}_${character}`} character={character}/>
      );
      let reindex = () => {
        console.log(fic.url);
        ApiUtil.reindex(fic.url)
        .done((res) => {
          this.props.update();
        });
      }
      accordionContent.push(
        <div className="content" key={`${fic._id}_content`}>
          <div className="ui grid">
            <div className="thirteen wide column">
              <p>{fic.summary}</p>
              {characterLabels} <b>{fic.word_cnt}</b>
            </div>
            <div className="three wide column">
              <a className="ui green button" href={fic.url} target="_blank" style={{ float: 'right' }}>GO</a>
              <FicSettingsButton reindex={reindex}/>
            </div>
          </div>
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
