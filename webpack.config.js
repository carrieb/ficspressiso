var path = require("path");

module.exports = [{
  context: path.join(__dirname, "web"),
  entry: {
    app: "app.js"
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
   root: [path.join(__dirname, "web")],
   modulesDirectories: ["node_modules"],
   alias: {
     src: path.join(__dirname, "src")
   }
 }
}];
