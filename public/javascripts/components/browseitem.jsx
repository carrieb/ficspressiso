const React = require('react');

const BrowseItem = React.createClass({
  render() {
    const cacheBust = new Date().getTime();
    return(<div className="item">
      <div className="image">
        <img src={ "https://unsplash.it/200/200/?random=" + cacheBust }/>
      </div>
      <div className="content">
        <a className="header">{ this.props.title }</a>
        <div className="meta"><span>{ this.props.author }</span></div>
        <div className="description"><p>{ this.props.summary }</p></div>
        <div className="extra">{ this.props.extra }</div>
      </div>
    </div>);
  }
});

module.exports = BrowseItem
