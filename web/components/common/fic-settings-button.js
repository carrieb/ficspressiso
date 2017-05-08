import React from 'react';

const FicSettingsButton = React.createClass({
  propTypes: {
    reindex: React.PropTypes.func
  },

  componentDidMount() {
    $(this.dropdown).dropdown();
  },

  reindex() {
    if (this.props.reindex) {
      this.props.reindex();
    }
  },

  render() {
    return (
      <div className="fic-settings-button ui top right pointing dropdown icon button"
           ref={(ref) => { this.dropdown = ref }}>
        <i className="wrench icon"/>
        <div className="menu">
          <div className="header">Fic Record Options</div>
          <div className="item" onClick={this.reindex}>Clean Re-index</div>
        </div>
      </div>
    )
  }
});

export default FicSettingsButton;
