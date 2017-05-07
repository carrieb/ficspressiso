import React from 'react';

import ApiUtils from '../../api/util.js'

import ColorMapper from '../../state/ColorMapper.js';

const ApiMultipleCharacterDropdown = React.createClass({
  propTypes: {
    characters: React.PropTypes.array.isRequired,
    updateCharacters: React.PropTypes.func.isRequired
  },

  componentDidMount() {
    $(this.dropdown).dropdown({
      onChange: this.onChange
    });
  },

  onChange(valueString) {
    this.props.updateCharacters(valueString.split(','));
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loaded && !prevState.loaded) {
      $(this.dropdown).dropdown({
        onChange: this.onChange
      });
    }
  },

  getInitialState() {
    return {
      loaded: false,
      characterOptions: []
    };
  },

  componentWillMount() {
    this.loadCharacterOptions();
  },

  loadCharacterOptions() {
    this.setState({ loaded: false });
    ApiUtils.getCharacters()
    .done((characterOptions) => {
      this.setState({
        loaded: true,
        characterOptions
      })
    });
  },

  render() {
    const options = this.state.characterOptions.map((character, idx) => {
      return (
        <div className="item" key={idx} data-value={character} data-text={character}>
          {character}
        </div>
      );
    });
    return (
      <div className={`ui ${this.state.loaded ? '' : 'loading '}fluid multiple search selection dropdown`} ref={(dropdown) => { this.dropdown = dropdown; }}>
        <input type="hidden" name="characters" value={this.props.characters.join(',')}/>
        <i className="dropdown icon"></i>
        <div className="default text">Characters...</div>
        <div className="menu">
          { options }
        </div>
      </div>
    );
  }
});

export default ApiMultipleCharacterDropdown;
