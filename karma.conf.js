// this allows us to re-use the important bit from the webpack config
// and avoids duplication in the webpack section of the karma config
var webpackConfig = require('./webpack.config');

// BUT: we need to switch to inline source maps and remove the entry object 
// to make karma happy
webpackConfig.devtool = 'inline-source-map';
webpackConfig.entry = {};

// this points karma to the test.bundle.js file only
// that file pulls in all of the .spec.js files and uses our
// existing webpack rules to build a test bundle.
module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    reporters: ['dots'],
    files: [
      'test.bundle.js'
    ],
    preprocessors: {
        'test.bundle.js': ['webpack','sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
        noInfo: true
    }

  });
}
