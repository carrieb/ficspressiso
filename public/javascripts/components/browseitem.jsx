const React = require('react');

const BrowseItem = React.createClass({
  render() {
    const cacheBust = new Date().getTime();
    // TODO: intelligent splitting on back-end
    const split_extras = this.props.extra.split(' - ');
    const extra_labels = split_extras.map((item, i, arr) => {
      return (<div key={ `${this.props.title}_${i}` } className="ui label browse_desc">{ item }</div>);
    });
    return(<div className="item">
      <div className="image">
        <img src={ "https://unsplash.it/200/200/?random=" + cacheBust }/>
      </div>
      <div className="middle aligned content browse_item_content">
        <a href={"https://www.fanfiction.net" + this.props.url } className="header">{ this.props.title }</a>
        <div className="meta"><span>{ this.props.author }</span></div>
        <div className="description"><p>{ this.props.summary }</p></div>
        <div className="extra">{ extra_labels }</div>
      </div>
    </div>);
  }
});

module.exports = BrowseItem
