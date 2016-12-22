const React = require('react');
const BrowseSearch = require('./browsesearch');
const BrowseItem = require('./browseitem');

const Browse = React.createClass({
  getInitialState() {
    return {
      fics: [],
      page: 1,
      loaded: false,
      character: null
    }
  },
  render() {
    var loadingBar = null;
    var browseContent = null;
    const browseItems = this.state.fics.map((fic, i) => {
      return (<BrowseItem key={i} fic={fic} highlight={[this.state.character]}/>);
    });
    if (this.state.loaded) {
      console.log(this.state.fics);
      browseContent = (
        <div>
          <div style={{ float: "right", paddingLeft: '25px' }}><button onClick={ this.next } className="ui blue button">Next</button></div>
          <BrowseSearch requestContent={ this.requestContent }/>
          <div className="ui relaxed items">
            { browseItems }
          </div>
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
    //console.log('what');
    this.setState({
      page: this.state.page + 1,
      loaded: false
    });
    this.requestContent(this.state.page + 1, this.state.character);
  },
  requestContent(page, character) {
    //console.log("requesting fics..", page, character);
    $.ajax('/ajax/browse', {
      type: 'GET',
      data: {
        page: page,
        fandom: null,
        character: character
      }
    }).done((data) => {
      //console.log(data);
      this.setState({
        fics: data,
        loaded: true,
        page: page,
        character: character
      });
    })
  },
  componentWillMount() {
    if (!this.state.loaded) {
      this.requestContent(this.state.page, null);
    }
  }
});

module.exports = Browse;
