import React from 'react';

import util from 'src/util';

const NewFilter = React.createClass({
  propTypes: {
    updateFilterQuery: React.PropTypes.func.isRequired,
    options: React.PropTypes.object.isRequired /* e.g. { fandoms: [a, b, c], characters: [x, y, z] } */
  },

  componentDidMount() {
    $(this.dropdown).dropdown({
      showOnFocus: false,
      onChange: this.handleChange,
      placeholder: ''
    });
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
        return (
          <div className="item" key={`${category}_${idx}`} data-category={category}>
            <div className={`ui ${util.randomColor()} empty circular label`}/>
            <span>{ option }</span>
          </div>
        );
      });
      return [
        (<div className="divider"></div>),
        (<div className="header">
          <i className="tags icon"></i>
          Filter by { category }
        </div>)
      ].concat(optionEls);
    });

    const flattenedSections = [].concat.apply([], optionSections);
    return (
      <div className="ui labeled icon top center pointing dropdown button" ref={(dropdown) => {this.dropdown = dropdown}}>
        <i className="filter icon"></i><span className="text">Filter</span>
        <div className="menu">
          <div className="ui search icon input">
            <i className="search icon"></i>
            <input type="text" name="search" placeholder="Search stories..."/>
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
