import React from 'react';

import uniqueId from 'lodash/uniqueId';

const CharacterLabel = React.createClass({
  propTypes: {
    character: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  },

  getInitialState() {
    return {
      hover: false
    }
  },

  componentDidMount() {
      $(this.label).hover(() => {
        this.setState({ hover: true });
      }, () => {
        this.setState({ hover: false });
      });
  },

  handleClick(character) {
    if (this.props.onClick) {
      this.props.onClick(character);
    }
  },

  render() {
    const char = this.props.character;
    return (
      <div className="ui huge basic image label character-label"
           ref={(label) => {this.label = label;}}
           onClick={() => this.handleClick(character)}>
        <img src={`/images/characters/${char}.jpg`}/>
        { this.state.hover && (<span key={uniqueId()}>{char}</span>) }
      </div>
    );
  }
});

export default CharacterLabel;
