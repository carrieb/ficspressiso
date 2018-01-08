var path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


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
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'url-loader?limit=100000'
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
}, {
  context: path.join(__dirname, 'chrome-extension', 'ao3'),
  entry: {
    'ao3': 'ao3.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.join(__dirname, 'chrome-extension', 'dist')
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
          loader: 'babel-loader'
        }]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'url-loader?limit=100000'
        }]
      }
    ]
  },
  resolve: {
   // you can now require('file') instead of require('file.coffee')
   extensions: [".js", ".jsx"],
   modules: ["node_modules", path.join(__dirname, 'chrome-extension', 'ao3')],
   alias: {
     components: path.join(__dirname, 'chrome-extension', 'react')
   }
 },
 plugins: [
    new UglifyJsPlugin()
  ]
}];
