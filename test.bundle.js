// find all .spec.js files in the project src directory and
// make a context that karma can use to build a bundle
var context = require.context('./src', true, /.+\.spec\.js$/);
context.keys().forEach(context);
module.exports = context;
