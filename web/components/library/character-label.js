import React from 'react';

import uniqueId from 'lodash/uniqueId';

const CharacterLabel = React.createClass({
  componentDidMount() {
      $(this.label).hover(() => {
        this.setState({ hover: true });
      }, () => {
        this.setState({ hover: false });
      });
  },

  getInitialState() {
    return {
      hover: false
    }
  },

  render() {
    const char = this.props.character;
    return (
      <div className={`ui huge basic image label character-label`}
           ref={(label) => {this.label = label;}}
           onClick={() => {this.props.onClick({query: {characters: char}})}}>
        <img src={`/images/characters/${char}.jpg`}/>
        { this.state.hover && (<span key={uniqueId()}>{char}</span>) }
      </div>
    );
  }
});

export default CharacterLabel;
