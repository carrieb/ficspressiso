import React from 'react';

const Sort = React.createClass({
  propTypes: {
    updateSort: React.PropTypes.func.isRequired,
    currentSort: React.PropTypes.object.isRequired
  },

  componentDidMount() {
    $(this.dropdown).dropdown({
      showOnFocus: false,
      onChange: this.handleChange,
      placeholder: 'Name'
    });
  },

  handleChange(value, text, choice) {
    this.props.updateSort({
      by: choice[0].getAttribute('data-value'),
      order: this.props.currentSort.order
    });
  },

  updateSort() {
    this.props.updateSort({
      by: this.props.currentSort.by,
      order: this.props.currentSort.order === 'ascending' ? 'descending' : 'ascending'
    });
  },

  render() {
    const sortType = this.props.currentSort.by === 'title' ? 'alphabet' : 'content';
    return (
      <span className="sort-container">
        <div className="ui labeled icon top center pointing dropdown button sort-dropdown" ref={(dropdown) => {this.dropdown = dropdown}}>
          <i className="sort icon"></i><span className="text">Sort</span>
          <div className="menu">
            <div className="item" data-value="title">Name</div>
            <div className="item" data-value="word_cnt">Length</div>
            <div className="item" data-value="fav_cnt">Favorites</div>
            <div className="item" data-value="follow_cnt">Follows</div>
            <div className="item" data-value="review_cnt">Reviews</div>
          </div>
        </div>
        <button className="ui icon button" onClick={this.updateSort}>
          <i className={`sort ${sortType} ${this.props.currentSort.order} icon`}></i>
        </button>
      </span>
    )
  }

});

export default Sort;
