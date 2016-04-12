const React = require('react');

const Browse = React.createClass({
  getInitialState() {
    return {
      'content' : 'Loading...'
    }
  },
  createMarkup() {
    return {__html: this.state.content};
  },
  render() {
    return (<div className="browse_content">
      <div className="ui relaxed items" dangerouslySetInnerHTML={this.createMarkup()}/>
    </div>);
  },
  requestContent() {
    $.ajax('/ajax/browse', {
      type: 'GET'
    }).error((req, status, error) => {
      console.error(error)
    }).done((data) => {
      this.setState({ content: data });
    })
  },
  componentDidMount() {
    this.requestContent();
  }
});

module.exports = Browse;
