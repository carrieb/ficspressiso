var React = require("react"),
    ReactDOM = require('react-dom'),
    App = React.createFactory(require("components/app"));

if (typeof window !== "undefined") {
  window.onload = function() {
    console.log(window['initJson']);
    ReactDOM.render(App({
      initialSection: window['initJson']['initialSection'],
      renderChart: true
    }), document.getElementById("content"));
  };
}
