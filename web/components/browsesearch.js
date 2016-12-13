var React = require('react');

var BrowseSearch = React.createClass({
  componentDidMount() {
    $('#search').search({
      apiSettings: {
        url: `/ajax/browse_filter?q={query}`
      },
      type: 'category',
      onSelect: (result, response) => {
        this.props.requestContent(1, result.title);
      }
    });
  },
  render() {
    return (
      <div id="search" className="ui fluid category search" style={{ width: '85%' }}>
        <div className="ui icon input" style={{ width: '100%' }}>
          <input className="prompt" type="text" placeholder="Filter by character..."></input>
          <i className="circular search link icon"></i>
        </div>
        <div className="results"></div>
      </div>
    );
  }
});

module.exports = BrowseSearch;
