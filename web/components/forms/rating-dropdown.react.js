import React from 'react';
import PropTypes from 'prop-types';

import _isEmpty from 'lodash/isEmpty';

class RatingDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(this.dropdownRef).dropdown({
      onChange: (valueString) => {
        if (!_isEmpty(valueString)) {
          this.props.updateRating(valueString.split(','));
        } else {
          this.props.updateRating([])
        }
      }
    });
  }

  render() {
    return (
      <div className="ui fluid multiple selection dropdown"
           ref={(ref) => this.dropdownRef = ref}>
        <input type="hidden" name="rating" value={this.props.rating.join(',')}/>
        <i className="dropdown icon"/>
        <div className="default text">Rating...</div>
        <div className="menu">
          <div className="item" data-value="M" data-text="M">M</div>
          <div className="item" data-value="T" data-text="T">T</div>
        </div>
      </div>
    )
  }
}

RatingDropdown.propTypes = {
  updateRating: PropTypes.func,
  rating: PropTypes.array
};

RatingDropdown.defaultProps = {
  rating: []
};

export default RatingDropdown;
