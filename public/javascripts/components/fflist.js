var React = require("react"),
    FFItem = React.createFactory(require("./ffitem")),
    FFFilter = require("./fffilter");

var FFList = React.createClass({
  render() {
    var rows = []
    for (var i = 0; i < this.props.meta.length; i++) {
      rows.push(FFItem({
        "data" : this.props.meta[i],
        "key" : i,
        "loadFicContent" : this.props.loadFicContent,
        "selected" : this.props.currentFic ? this.props.currentFic.title === this.props.meta[i].title : false
      }));
    }
    return (
      <div className="fic_list">
        { rows }
      </div>
    );
  }
});

module.exports = FFList
