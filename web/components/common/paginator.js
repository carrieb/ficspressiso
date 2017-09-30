import React from 'react';
import PropTypes from 'prop-types';

class Paginator extends React.Component {
  goToNextPage() {
    if (this.props.page !== this.props.maxPage)
      this.props.goToPage(this.props.page + 1)
  }

  goToPreviousPage() {
    if (this.props.page !== 1) this.props.goToPage(this.props.page - 1)
  }

  render() {
      const previous = (<a onClick={() => this.goToPreviousPage()}>
        <i className={`teal large arrow left icon ${this.props.page === 1 ? 'disabled' : ''}`}/>
      </a>);
      const next = (<a onClick={() => this.goToNextPage()}>
        <i className={`teal large arrow right icon ${this.props.maxPage === this.props.page ? 'disabled' : ''}`}/>
      </a>);
      return (
        <div className="paginator-wrapper">
          { previous }
          <a className="ui active basic button">{this.props.page}</a>
          { next }
        </div>
      )
  }
}

Paginator.propTypes = {
  page: PropTypes.number,
  goToPage: PropTypes.func,
  maxPage: PropTypes.number
};

Paginator.defaultProps = {
  page: 1,
  maxPage: 1
};

export default Paginator;
