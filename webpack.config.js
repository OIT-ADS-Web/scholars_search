// the html plugin will dynamically add the bundle script tags to the main index.html file
// it also allows us to use template to build the rest of that file
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path');
var webpack = require('webpack')

// FIXME: how to vary this per build ... 
//require('dotenv').config({path: '/custom/path/to/your/env/vars'});
var environment = process.env.NODE_ENV || 'development'
console.log(environment)
// FIXME: how to vary this per build ... 
//require('dotenv').config({path: '/custom/path/to/your/env/vars'});
var config = require('dotenv').config({path: __dirname + '/.env.'+ environment})
console.log(config)

// can do this too:
// node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/your/env/vars
// (see) https://www.npmjs.com/package/dotenv#preload
//
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
    filename: "[name].js"/*,*/
  },
  //resolve: {
  //  alias: {
  //     config: path.join(__dirname, 'src/config', process.env.NODE_ENV || 'development')
  //  }
  //},
  module: {
    loaders: [
      // FIXME: use bootstrap (less) or not? 
      { test: /\.(woff|woff2)$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf$/,    loader: "file-loader" },
      { test: /\.eot$/,    loader: "file-loader" },
      { test: /\.svg$/,    loader: "file-loader" },
      // style pre-processing
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|gif)$/, loader: 'file-loader' },
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
    new webpack.DefinePlugin({
        'process.env.SOLR_URL': JSON.stringify(process.env.SOLR_URL),
        'process.env.ORG_URL':  JSON.stringify(process.env.ORG_URL)
    })
  ]
}
