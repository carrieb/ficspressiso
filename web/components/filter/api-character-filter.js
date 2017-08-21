import React from 'react';

import ApiUtils from '../../api/util.js';

import Filter from './new-filter.js';

const ApiCharacterFilter = React.createClass({
  propTypes: {
      currentQuery: React.PropTypes.object.isRequired,
      updateQuery: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      characters: [],
      loaded: false
    }
  },

  componentWillReceiveProps(newProps) {
    // TODO: check if currentQuery.fandom is the same and if not, reload characters
    if (newProps.currentQuery.fandom !== this.props.currentQuery.fandom) {
      this.requestCharacters(newProps.currentQuery.fandom);
    }
  },

  componentWillMount() {
    this.requestCharacters();
  },

  requestCharacters(fandom = this.props.currentQuery.fandom) {
    ApiUtils.getCharacters({fandom})
      .done((characters) => {
        //console.log(characters);
        this.setState({
          characters,
          loaded: true
        });
      });
  },

  render() {
    let content = null;
    if (this.state.loaded) {
      content = (
        <Filter options={{ characters: this.state.characters }}
                currentQuery={ this.props.currentQuery }
                labelText="Filter Characters"
                searchPlaceholder="Search characters..."
                updateFilterQuery={ this.props.updateQuery }/>
      );
    }
    return (
      <div className="api-character-filter-container">
        {content}
      </div>
    );
  }
});

export default ApiCharacterFilter;
