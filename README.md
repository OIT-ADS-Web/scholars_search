# scholars_search

## Getting Started
Install node dependencies:

    npm install

## Start the development server:

    npm start

    or (if need to set an environment):

    NODE_ENV=(development|development_acceptance) npm start


Navigate to:

    http://localhost:8333/

This will watch all files, rebuild and hot-load the running dev server code with your changes. No need to refresh the browser.

## Connecting to SOLR
  
  Connecting to a local SOLR via this url: "http://localhost/ROOTsolr/collection1/select"


  Therefore need these lines in /etc/apache2/others/scholars.conf

  ProxyPass /scholars_search/ http://localhost:8333/
  ProxyPassReverse /scholars_search/ http://localhost:8333/

  ProxyPass / http://localhost:9080/
  ProxyPassReverse / http://localhost:9080/


  NOTE: this means you have to do this to connect (note trailing slash)

  http://localhost/scholars_search/

## Tests
Testing is done with the [Karma]() test runner and the [Jasmine]() framework. Tests in this example are written with es6 syntax.

To run tests:

    npm run test

This will watch all files involved in the defined tests and automatically rebuild/test on save.
