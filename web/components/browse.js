import React from 'react';

import ApiCharacterFilter from './filter/api-character-filter.js';
import Filter from './filter/new-filter.js';
import ApiFicList from './api-fic-list.js';

import BrowseItem from './browseitem.js';

import LoadingBar from './loading/loading-bar.js';

import ApiUtils from '../api/util.js';

const Browse = React.createClass({
  getInitialState() {
    // TODO: add a fandom tag
    return {
      page: 1, // TODO: hook these into a router path
      characters: [],
      fandom: 'Harry Potter'
    }
  },

  next() {
    this.setState({
      page: this.state.page + 1,
      loaded: false
    });
  },

  refreshSticky() {
    $(this.sticky).sticky({
      context: '#sticky-context'
    });
  },

  handleCharacterFilterChange(newQuery) {
    const newCharacters = [newQuery.characters];// TODO: make this not bad
    this.setState({
      characters: newCharacters,
      page: 1
    });
    //this.refreshSticky();
  },

  handleFandomFilterChange(newQuery) {
    console.log(newQuery);
    this.setState({
      fandom: newQuery.fandoms,
      page: 1,
      characters: []
    });
    //this.refreshSticky();
  },

  render() {
    return (
      <div className="browse-container">
        <div className="ui sticky" ref={(sticky) => { this.sticky = sticky; }}>
          <div className="browse-navbar">
            <div className="ui grid">
              <div className="twelve wide column">
                <Filter options={{ fandoms: ['Harry Potter', 'Star Wars'] }}
                        updateFilterQuery={ this.handleFandomFilterChange }
                        currentQuery={{ fandoms: this.state.fandom || '' }}
                        cornerIcon="book"
                        labelText="Filter Fandom"
                        searchPlaceholder="Search fandoms..."/>
                      <ApiCharacterFilter currentQuery={{ characters: this.state.characters.length === 1 ? this.state.characters[0] : '', fandom: this.state.fandom }}
                                    updateQuery={ this.handleCharacterFilterChange }/>
              </div>
              <div className="right aligned four wide column">
                <div className="right floated">
                  <button onClick={ this.next } className="ui blue button">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="sticky-context">
          <ApiFicList currentQuery={{ page: this.state.page, characters: this.state.characters, fandom: this.state.fandom }}
                      updateQuery={(newQuery) => { this.setState(newQuery); }}
                      onLoaded={() => { this.refreshSticky() }}/>
        </div>
      </div>
    );
  },
});

module.exports = Browse;
