const React = require('react');

const Browse = React.createClass({
  getInitialState() {
    return {
      'content' : 'Loading...',
      page: 1
    }
  },
  createMarkup() {
    return {__html: this.state.content};
  },
  render() {
    return (<div className="browse_content">
      <div style={{ textAlign: "right" }}><button onClick={ this.next }className="ui blue button">Next</button></div>
      <div className="ui relaxed items" dangerouslySetInnerHTML={this.createMarkup()}/>
    </div>);
  },
  next() {
    this.setState({
      page: this.state.page + 1
    });
    this.requestContent(this.state.page + 1);
  },
  requestContent(page) {
    $.ajax('/ajax/browse', {
      type: 'GET',
      data: {
        page: page,
        fandom: null,
        character: null
      }
    }).error((req, status, error) => {
      console.error(error)
    }).done((data) => {
      this.setState({ content: data });
    })
  },
  componentDidMount() {
    this.requestContent(this.state.page);
  }
});

module.exports = Browse;
