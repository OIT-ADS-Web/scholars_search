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

//require("bootstrap-webpack!../bootstrap.config.js")


// can do this too:
// node -r dotenv/config your_script.js dotenv_config_path=/custom/path/to/your/env/vars
// (see) https://www.npmjs.com/package/dotenv#preload
//
//
//'babelPreprocessor': {
//  options: {
//    optional: ['runtime'],  // per http://babeljs.io/docs/usage/options/
//    sourceMap: 'inline'
//  },
//
// http://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined-with-async-await
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
    filename: "[name].js",
    library: "ScholarsSearch",
    libraryTarget: "umd"/*,*/
    /*publicPath: "/src/images/"*/
  },
  // NOTE: this is in here so nock can run tests - but they don't work anyway
  //node: {
  // fs: "empty"
  //},
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
      { test: /jquery/, loader: 'expose?$!expose?jQuery' },
      // react/jsx and es6/2015 transpiling
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        // http://asdfsafds.blogspot.com/2016/02/referenceerror-regeneratorruntime-is.html
        query: {
          presets: ['react','es2015'],
          plugins: ["transform-runtime"]
        }
      }/*, */
      //{ test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' }
    ]
  },
  // make sourcemaps in separate files
  devtool: 'source-map',
  plugins: [
    // build index from template, add cach-busting hashes to js bundle urls
    // pass title variable to the template - you can specify any property here
    // and access it in the src/index.ejs template
    //  inject: 'head',
    //  hash: true,
    //  title: "Calendar Demo",
    //  template: 'src/index.ejs/'
 
    new HtmlWebpackPlugin({
      inject: 'head',
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
