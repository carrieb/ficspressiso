import React from 'react';

import util from 'src/util';

import ColorMapper from '../../state/ColorMapper';

import uniqueId from 'lodash/uniqueId';

const NewFilter = React.createClass({
  propTypes: {
    updateFilterQuery: React.PropTypes.func.isRequired,
    options: React.PropTypes.object.isRequired /* e.g. { fandoms: [a, b, c], characters: [x, y, z] } */,
    currentQuery: React.PropTypes.object.isRequired,
    searchPlaceholder: React.PropTypes.string,
    labelText: React.PropTypes.string
  },

  componentDidMount() {
    $(this.dropdown).dropdown({
      showOnFocus: false,
      onChange: this.handleChange
    });
  },

  componentDidUpdate(prevProps) {
    const currentChar = this.props.currentQuery.characters;
    //console.log(prevProps);
    //console.log(currentChar);
    if (currentChar && prevProps.currentQuery.characters !== currentChar) {
      $(this.dropdown).dropdown('set selected', `characters_${currentChar}`);
    }
  },

  handleChange(value, text, choice) {
    var item = choice[0];
    var query = {}
    if (item && item.textContent !== "All") {
      var cat = item.getAttribute('data-category');
      query[cat] = item.textContent;
    }

    this.props.updateFilterQuery(query);
  },

  render() {
    const optionSections = Object.keys(this.props.options).map((category) => {
      const optionEls = this.props.options[category].map((option, idx) => {
        const color = ColorMapper.getColor(category, option);
        const id = uniqueId();
        return (
          <div className="item" key={id} data-category={category} data-value={`${category}_${option}`}>
            <div className={`ui ${color} empty circular label`}/>
            <span>{ option }</span>
          </div>
        );
      });
      return [
        (<div className="divider" key={uniqueId()}></div>),
        (<div className="header" key={uniqueId()}>
          <i className="tags icon"></i>
          Filter by { category }
        </div>)
      ].concat(optionEls);
    });

    const flattenedSections = [].concat.apply([], optionSections);
    return (
      <div className="ui labeled icon top center pointing scrolling dropdown button" ref={(dropdown) => {this.dropdown = dropdown}}>
        <i className="filter icon"></i><span className="text">{this.props.labelText || 'Filter'}</span>
        <div className="menu">
          <div className="ui search icon input">
            <i className="search icon"></i>
            <input type="text" name="search" placeholder={this.props.searchPlaceholder || 'Search stories...' }/>
          </div>
          <div className="divider"></div>
          <div className="item" key="all">
            <span>All</span>
          </div>
          {flattenedSections}
        </div>
      </div>
    )
  }
});

export default NewFilter;