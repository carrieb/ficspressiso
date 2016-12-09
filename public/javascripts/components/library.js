var React = require("react"),
  FFList = require("./fflist"),
  FFReader = require('./ffreader'),
  FFFilter = require('./fffilter');

var Library = React.createClass({
  getInitialState() {
    return {
      "content" : "",
      "chp" : 0,
      "ff_meta" : [],
      "fic" : null,
      timeout: null,
      query: {}
    };
  },

  onRetrievedFicContent(data, title, chp) {
    //console.log("Retrieved content for " + title + ": " + chp, data);
    var meta = this.getMetaForFic(title);
    var split = data.split(/\r\n|\r|\n/);
    var result = split.map((item, index) => {
      if (item.length > 0) {
        return (
          <div key={ index }>{ item }</div>
        );
      }
    });
    this.setState({
      "content" : result,
      "chp" : chp,
      "fic" : meta
    })
    window.scrollTo(0, 0);
  },

  getMetaForFic(title) {
    for (var i = 0; i < this.state.ff_meta.length; i++) {
      var fic = this.state.ff_meta[i];
      if (fic['title'] === title) {
        return fic;
      }
    }
    console.error("No data found for " + title, this.state.ff_meta);
    return null;
  },

  requestFFContent(callback, title, chp) {
    //console.log("Requesting content for " + title + ": " + chp);
    $.ajax('/ajax/ff_content', {
      data : {
        "title" : title,
        "chp" : chp
      }
    }).error((req, status, error) => {
      console.error(error);
    }).done((data) => {
      callback(data, title, chp);
    });
  },

  updateFilterQuery(query) {
    this.setState({ query });
  },

  render() {
    console.log("library render");
    return (
      <div>
        <div className="left_bar">
          <div style={{ textAlign: 'center', paddingBottom: '25px'}}>
             <FFFilter updateFilterQuery={this.updateFilterQuery}/>
          </div>
          <FFList meta={ this.state.ff_meta }
                  currentFic={ this.state.fic }
                  loadFicContent={ this.requestFFContent.bind(this, this.onRetrievedFicContent) }
                  query={ this.state.query }
          />
        </div>
      <FFReader content={ this.state.content }
                loadFicContent={ this.requestFFContent.bind(this, this.onRetrievedFicContent, this.state.fic ? this.state.fic['title'] : null)}
                currentChp={ this.state.chp }
                lastChp={ this.state.fic ? this.state.fic['chapters'].length - 1 : 0 }
                chpTitle={this.state.fic ? this.state.fic['chapters'][this.state.chp]['title'] : ""}
                ficTitle={ this.state.fic ? this.state.fic['title'] : "" }
                chapters={ this.state.fic ? this.state.fic['chapters'] : [] }/>

      </div>
    );
  }
});

module.exports = Library;
