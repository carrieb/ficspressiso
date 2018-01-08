import React from 'react';
import PropTypes from 'prop-types';

import _range from 'lodash/range';

class StarSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { highlighted: -1 }
  }

  onMouseEnter(i) {
    return (ev) => {
      this.setState({ highlighted: i })
    }
  }

  onMouseLeave(i) {
    return (ev) => {
      this.setState({ highlighted: -1 });
    }
  }

  render() {
    const stars = _range(5).map((i) => {
      let classes = ['star'];
      if (this.state.highlighted >= i) { classes.push('highlighted'); }
      const star = this.props.value - 1 >= i ? '★' : '☆';
      return <span key={i}
                   className={classes.join(' ')}
                   onMouseEnter={this.onMouseEnter(i)}
                   onMouseLeave={this.onMouseLeave(i)}>{ star }</span>;
    });
    return <span className="star-selector">
      { stars }
    </span>;
  }
}

StarSelector.propTypes = {
  value: PropTypes.number
}

export default StarSelector;
