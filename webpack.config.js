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
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['react', 'es2015']}
        }]
      }
    ]
  },
  resolve: {
   // you can now require('file') instead of require('file.coffee')
   extensions: [".js", ".jsx"],
   modules: ["node_modules", path.join(__dirname, "web")],
   alias: {
     src: path.join(__dirname, "src"),
     components: path.join(__dirname, "web", "components"),
     api: path.join(__dirname, "web", "api"),
     state: path.join(__dirname, "web", "state"),
     utils: path.join(__dirname, "web", "util"),
     styles: path.join(__dirname, "public", "stylesheets")
   }
 }
}];
