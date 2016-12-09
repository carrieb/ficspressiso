import React from 'react';

const initJson = window.initJson;
const characters = initJson.characters;
const fandoms = initJson.fandoms;

// TODO: build clearing out value into this


var FFFilter = React.createClass({
  render() {
    const characterOptions = characters.map((character, idx) => {
      return (
        <div className="item" key={`char_${idx}`} data-category="character">
          <div className="ui blue empty circular label"/>
          <span>{ character }</span>
        </div>
      );
    });
    const fandomOptions = fandoms.map((fandom, idx) => {
      return (
        <div className="item" key={`fandom_${idx}`} data-category="fandom">
          <div className="ui blue empty circular label"/>
          <span>{ fandom }</span>
        </div>
      );
    });
    var filterDropdown = (
      <div id="fic_filter" className="ui labeled icon top center pointing dropdown button">
        <i className="filter icon"></i>
        <span className="text" id="selected_filter">Filter Stories</span>
        <div className="menu">
          <div className="ui search icon input">
            <i className="search icon"></i>
            <input type="text" name="search" placeholder="Search stories..."/>
          </div>
          <div className="divider"></div>
          <div className="item" key="all">
            <span>All</span>
          </div>
          <div className="divider"></div>
          <div className="header">
            <i className="tags icon"></i>
            Filter by fandom
          </div>
          { fandomOptions }
          <div className="divider"></div>
          <div className="header">
            <i className="user icon"></i>
            Filter by characters
          </div>
          { characterOptions }
        </div>
      </div>
    );
    return (filterDropdown);
  },

  componentDidUpdate() {
    $('.ui.dropdown').dropdown('refresh');
  },

  handleChange(value, text, choice) {
    // semantic ui is dumb, prevent invariant violation error
    var childs = $("#selected_filter").children()
    for (var i =0; i < childs.length; i++) {
      var el = childs[i];
      el.removeAttribute('data-reactid');
    }
    var item = choice[0];
    var query;
    if (item && item.textContent !== "All") {
      var cat = item.getAttribute('data-category');
      query = {};
      query[cat] = item.textContent;
    }
  },

  componentDidMount() {
    $('#fic_filter.ui.dropdown').dropdown({
      showOnFocus: false,
      onChange: this.handleChange,
      placeholder: ''
    });
  }
});

module.exports = FFFilter
