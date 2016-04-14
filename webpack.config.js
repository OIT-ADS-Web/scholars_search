// the html plugin will dynamically add the bundle script tags to the main index.html file
// it also allows us to use template to build the rest of that file
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path');
var webpack = require('webpack')

var config = require('dotenv').config()
console.log(config)

module.exports = {
  // start an main.js and follow requires to build the 'app' bundle in the 'dist' directory
  entry: {
    app: "./src/main.js",
  },

  // put all built files in dist
  // use 'name' variable to make 
  // bundles named after the entryoints
  // above
  output: {
    path: __dirname + "/dist/",
    filename: "[name].js"
  },
  //resolve: {
  //  alias: {
  //     config: path.join(__dirname, 'src/config', process.env.NODE_ENV || 'development')
  //  }
  //},
  //node: { fs: "empty" },
  module: {
    loaders: [
      // style pre-processing
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader' },

      // react/jsx and es6/2015 transpiling
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react','es2015']
        }
      }
    ]
  },
  // make sourcemaps in separate files
  devtool: 'source-map',
  plugins: [
    // build index from template, add cach-busting hashes to js bundle urls
    // pass title variable to the template - you can specify any property here
    // and access it in the src/index.ejs template
    new HtmlWebpackPlugin({
      hash: true,
      title: "Scholars Search",
      template: 'src/index.ejs/'
    }),
    //new webpack.DefinePlugin({
    //  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    //  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
    //});
    //https://github.com/mderrick/webpack-react-boilerplate/blob/master/webpack.default.config.js
     //new webpack.DefinePlugin({
     //   ENV: require(path.join(__dirname, './', process.env.NODE_ENV || 'development'))
    //}), 
   //http://stackoverflow.com/questions/32217165/can-i-detect-if-my-script-is-being-processed-by-webpack
   // 
    new webpack.DefinePlugin({
        'process.env.SOLR_URL': JSON.stringify(process.env.SOLR_URL),
        'process.env.ORG_URL':  JSON.stringify(process.env.ORG_URL)
    })
  ]
}
