const React = require('react');

const BrowseItem = React.createClass({
  // props: fic, and highlight (arr of strings)
  // TODO: do highlighting
  render() {
    const fic = this.props.fic
    const cacheBust = new Date().getTime();
    // TODO: intelligent splitting on back-end
    const split_extras = fic.extra.split(' - ');
    const extra_labels = split_extras.map((item, i, arr) => {
      return (<div key={ `${fic.title}_${i}` } className="ui label browse_desc">{ item }</div>);
    });
    return(<div className="item">
      <div className="image">
        <img src={ "https://unsplash.it/200/200/?random=" + cacheBust }/>
      </div>
      <div className="middle aligned content browse_item_content">
        <a className="header" style={{ fontSize: '2 rem' }} href={"https://www.fanfiction.net" + fic.url } className="header">{ fic.title }</a>
        <div className="meta"><span>{ fic.author }</span></div>
        <div className="description"><p>{ fic.summary }</p></div>
        <div className="extra">{ extra_labels }</div>
      </div>
    </div>);
  }
});

module.exports = BrowseItem
