import React from 'react';
import PropTypes from 'prop-types';

import ApiUtils from 'utils/api-util'

import ColorMapper from '../../state/color-mapper.js';

import _isEmpty from 'lodash/isEmpty';

class ApiMultipleCharacterDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      characterOptions: []
    };
  }

  componentWillMount() {
    this.loadCharacterOptions();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loaded && !prevState.loaded) {
      $(this.dropdown).dropdown({
        onChange: this.onChange,
        onLabelCreate: this.onLabelCreate
      });
    }
  }

  onChange = (valueString) => {
    if (!_isEmpty(valueString)) {
      this.props.updateCharacters(valueString.split(','));
    } else {
      this.props.updateCharacters([])
    }
  }

  onLabelCreate = (value, text) => {
    const character = value;
    const colorArr = ColorMapper.getRgbArrayForCharacter(character);
    const rgba = "rgba(" + colorArr.join(',') + ",0.4)";
    return $(`<a class="ui label" data-value="${character}" style="background-color: ${rgba};">${character}<i class="delete icon"></i></a>`);
  };

  loadCharacterOptions() {
    this.setState({ loaded: false });

    ApiUtils.getCharacters()
      .done((characterOptions) => {
        this.setState({
          characterOptions
        });
      })
      .always(() => {
        this.setState({ loaded: true })
      })
  }

  render() {
    const options = this.state.characterOptions
      .map((character, idx) => {
        return (
          <div className="item"
               key={idx}
               data-value={character.name}
               data-text={character.name}
               style={{ lineHeight: '24px' }}>
              <div className="ui right floated small teal label">{character.count}</div>
            {character.name}
          </div>
        );
      });

    return (
      <div className={`ui ${!this.state.loaded && 'loading '}fluid multiple search selection dropdown`}
           ref={(dropdown) => { this.dropdown = dropdown; }}>
        <input type="hidden" name="characters" value={this.props.characters.join(',')}/>
        <i className="dropdown icon"/>
        <div className="default text">Characters...</div>
        <div className="menu">
          { options }
        </div>
      </div>
    );
  }
}

ApiMultipleCharacterDropdown.propTypes = {
  characters: PropTypes.array.isRequired,
  updateCharacters: PropTypes.func.isRequired
};

export default ApiMultipleCharacterDropdown;
