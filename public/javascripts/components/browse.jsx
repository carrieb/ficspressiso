const React = require('react');
const BrowseSearch = require('./browsesearch');

const Browse = React.createClass({
  getInitialState() {
    return {
      'content' : 'Loading...',
      page: 1,
      loaded: false
    }
  },
  createMarkup() {
    return {__html: this.state.content};
  },
  render() {
    var loadingBar = null;
    var browseContent = null;
    if (this.state.loaded) {
      browseContent = (
        <div>
          <div style={{ float: "right", paddingLeft: '25px' }}><button onClick={ this.next } className="ui blue button">Next</button></div>
          <BrowseSearch requestContent={ this.requestContent }/>
          <div className="ui relaxed items" dangerouslySetInnerHTML={this.createMarkup()}/>
        </div>
      );
    } else {
      loadingBar = (
        <div className="ui segment" style={{ border: 'none', boxShadow: 'none'}}>
          <div className="ui active inverted dimmer">
            <div className="ui medium text loader">Loading</div>
          </div>
          <p>hihihihi</p>
          <p>hihihihi</p>
          <p>hihihihi</p>
        </div>
      );
    }
    return (<div className="browse_content">
      {loadingBar}
      {browseContent}
    </div>);
  },
  next() {
    console.log('what');
    this.setState({
      page: this.state.page + 1,
      loaded: false
    });
    this.requestContent(this.state.page + 1, this.state.character);
  },
  requestContent(page, character) {
    console.log("requesting", page, character);
    $.ajax('/ajax/browse', {
      type: 'GET',
      data: {
        page: page,
        fandom: null,
        character: character
      }
    }).error((req, status, error) => {
      console.error(error)
    }).done((data) => {
      this.setState({
        content: data,
        loaded: true,
        page: page,
        character: character
      });
    })
  },
  componentDidMount() {
    console.log(this.state.loaded);
    if (!this.state.loaded) {
      this.requestContent(this.state.page, null);
    }
  }
});

module.exports = Browse;
