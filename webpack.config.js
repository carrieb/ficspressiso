var path = require("path");

module.exports = [{
  context: path.join(__dirname, "public", "javascripts"),
  entry: "app.js",
  entry: {
    app: 'app.js',
    library: 'app-library.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.join(__dirname, "public", "javascripts")
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
