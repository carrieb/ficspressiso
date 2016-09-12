var React = require('react');

var Button = React.createClass({
  render() {
    return (
      <button className="ui button" onClick={ this.props.callback } key={ this.props.key }>
        <i className={ this.props.icon + " icon" }/>
      </button>
    );
  }
});

module.exports = Button
