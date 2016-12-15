import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
      hober: false
    }
  },

  render() {
    const char = this.props.character;
    return (
      <div className={`ui huge basic image label character-label`}
           ref={(label) => {this.label = label;}}
           onClick={() => {this.props.onClick({query: {characters: char}})}}>
        <img src={`/images/characters/${char}.jpg`}/>
        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
          { this.state.hover && (<span key={uniqueId()}>{char}</span>) }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

export default CharacterLabel;
