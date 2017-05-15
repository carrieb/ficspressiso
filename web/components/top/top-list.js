import React from 'react';

import CharacterLabel from 'components/common/character-label';
import FicSettingsButton from 'components/common/fic-settings-button';

import ApiUtil from 'api/util';

import _bind from 'lodash/bind';

const TopList = React.createClass({
  propTypes: {
      items: React.PropTypes.array.isRequired,
      update: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      items: [],
      update: () => {}
    };
  },

  getInitialState() {
    return {
      openIndex: -1
    }
  },

  handleKeypress(e) {
    const key = e.which;
    console.log(e.which, this.state.openIndex);
    if (key === 40) { //down
      if (this.state.openIndex < this.props.items.length - 1) {
        this.setState({
          openIndex: this.state.openIndex + 1
        });
        $('.ui.accordion').accordion('open', this.state.openIndex)
        e.preventDefault();
      }
    }

    if (key === 38) { // up
      if (this.state.openIndex > 0) {
        this.setState({
          openIndex: this.state.openIndex - 1
        });
        $('.ui.accordion').accordion('open', this.state.openIndex)
        e.preventDefault()
      }
    }
  },

  onAccordionOpen(openIndex) {
    this.setState({ openIndex });
  },

  componentDidMount() {
    const onChange = (function (component) {
      return function() {
        console.log(this);
        const openIndex = $(this).data('index');
        console.log(component);
        component.onAccordionOpen(openIndex);
      };
    })(this);
    $('.ui.accordion').accordion({
      onChange
    });

    $(window).keydown(this.handleKeypress);
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
        <div className="content" key={`${fic._id}_content`} data-index={i}>
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
