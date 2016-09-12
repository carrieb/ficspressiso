var path = require("path");

module.exports = [{
  context: path.join(__dirname, "public", "javascripts"),
  entry: "app.js",
  output: {
    path: path.join(__dirname, "public", "javascripts"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { presets: ['react', 'es2015']}
      }
    ]
  },
  resolve: {
   // you can now require('file') instead of require('file.coffee')
   extensions: ["", ".js", ".jsx"],
   root: [path.join(__dirname, "public", "javascripts")],
   modulesDirectories: ["node_modules"]
 }
}];
