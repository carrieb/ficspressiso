import React from 'react';
import PropTypes from 'prop-types';

class ApiFicList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fics: [], loaded: false  };
  }

  componentWillMount() {
    this.loadFics();
  }

  loadFics() {
    this.setState({ loaded: false });
    return this.props.requestFics()
      .done((fics) => {
        console.log(fics);
        this.setState({ fics, loaded: true });
      });
  }

  render() {
    const ficEls = this.state.fics.map((fic, idx) => {
      return React.createElement(this.props.ficComponent, {
        fic,
        key: idx
      });
    });
    return (
      <div className="api-fic-list">
        { ficEls }
      </div>
    );
  }
  
}

ApiFicList.propTypes = {
  ficComponent: PropTypes.func.isRequired,
  requestFics: PropTypes.func.isRequired
};

export default ApiFicList;