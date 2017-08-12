import React from 'react';

const FicSettingsButton = React.createClass({
  propTypes: {
    reindex: React.PropTypes.func
  },

  getInitialState() {
    return {
      reindexing: false
    };
  },

  componentDidMount() {
    $(this.dropdown).dropdown();
  },

  reindex() {
    if (this.props.reindex) {
      this.setState({ reindexing: true })
      this.props.reindex(() => this.setState({ reindexing: false }));
    }
  },


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
          <div className="item" onClick={this.reindex}>Clean Re-index</div>
        </div>
      </div>
    )
  }
});

export default FicSettingsButton;
