import React from 'react';
import PropTypes from 'prop-types';

class FicSettingsButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reindexing: false
    };
  }

  componentDidMount() {
    $(this.dropdown).dropdown();
  }

  reindex() {
    if (this.props.reindex) {
      this.setState({ reindexing: true });
      this.props.reindex(() => this.setState({ reindexing: false }));
    }
  }

  render() {
    const className = this.state.reindexing
      ? 'fic-settings-button ui icon loading button'
      : 'fic-settings-button ui top left pointing dropdown icon button';

    return (
      <div className={className}
           ref={(ref) => { this.dropdown = ref }}>
        <i className="wrench icon"/>
        <div className="menu">
          <div className="header">Fic Record Options</div>
          <div className="item" onClick={() => this.reindex()}>Clean Re-index</div>
        </div>
      </div>
    );
  }
}

FicSettingsButton.propTypes = {
  reindex: PropTypes.func
}

export default FicSettingsButton;
