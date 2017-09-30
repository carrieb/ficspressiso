import React from 'react';
import PropTypes from 'prop-types';

import uniqueId from 'lodash/uniqueId';

class CharacterLabel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false
    };
  }

  componentDidMount() {
      $(this.label).hover(() => {
        this.setState({ hover: true });
      }, () => {
        this.setState({ hover: false });
      });
  }

  handleClick(character) {
    if (this.props.onClick) {
      this.props.onClick(character);
    }
  }

  render() {
    const char = this.props.character;
    return (
      <div className="ui huge basic image label character-label"
           ref={(label) => {this.label = label;}}
           onClick={() => this.handleClick(character)}>
        <img src={`/images/characters/${char}.jpg`}/>
        { this.state.hover && <span key={uniqueId()}>{char}</span> }
      </div>
    );
  }
}

CharacterLabel.propTypes = {
  character: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default CharacterLabel;
