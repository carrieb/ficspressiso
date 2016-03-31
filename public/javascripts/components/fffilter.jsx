var React = require("react");

// TODO: build clearing out value into this
var FFFilter = React.createClass({
  render() {
    var characterOptions = [];
    for (var i = 0; i < this.state.characters.length; i++) {
      characterOptions.push(
        <div className="item" key={ "char_" + this.state.characters[i] } data-category="character">
          <div className={"ui " + this.randomColor() + " empty circular label"}/>
          <span>{ this.state.characters[i] }</span>
        </div>
      );
    }
    var fandomOptions = [];
    for (var j = 0; j < this.state.fandoms.length; j++) {
      fandomOptions.push(
        <div className="item" key={ "fandom_" + this.state.fandoms[j] } data-category="fandom">
          <div className={"ui " + this.randomColor() + " empty circular label"}/>
          <span>{ this.state.fandoms[j] }</span>
        </div>
      );
    }
    var filterDropdown = (
      <div id="fic_filter" className="ui labeled icon top center pointing dropdown button">
        <i className="filter icon"></i>
        <span className="text" id="selected_filter">Filter Fics</span>
        <div className="menu">
          <div className="ui search icon input">
            <i className="search icon"></i>
            <input type="text" name="search" placeholder="Search stories..."/>
          </div>
          <div className="divider"></div>
          <div className="header">
            <i className="tags icon"></i>
            Filter by fandom
          </div>
          { fandomOptions }
          <div className="divider"></div>
          <div className="header">
            <i className="user icon"></i>
            Filter by characters
          </div>
          { characterOptions }
        </div>
      </div>
    );
    return (filterDropdown);
  },
  randomColor() {
    colors = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"];
    return colors[Math.floor(Math.random() * colors.length)]
  },
  getInitialState() {
    return {
      "characters": [],
      "fandoms": []
    }
  },
  requestFilterMeta() {
    $.ajax('/ajax/filter_meta').error((req, status, error) => {
      console.log(error);
    }).done((data) => {
      console.log(data);
      this.setState(data);
    });
  },
  componentDidUpdate() {
    $('.ui.dropdown').dropdown('refresh');
  },
  handleChange(value, text, choice) {
    // semantic ui is dumb, prevent invariant violation error
    var childs = $("#selected_filter").children()
    for (var i =0; i < childs.length; i++) {
      var el = childs[i];
      el.removeAttribute('data-reactid');
    }
    var item = choice[0];
    var cat = item.getAttribute('data-category');
    var query = {};
    query[cat] = item.textContent;
    this.props.updateFicMeta(query);
  },
  componentDidMount() {
    $('#fic_filter.ui.dropdown').dropdown({
      showOnFocus: false,
      onChange: this.handleChange,
      placeholder: ''
    });
    this.requestFilterMeta()
  }
});

module.exports = FFFilter
