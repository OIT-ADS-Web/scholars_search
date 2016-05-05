# scholars_search

## Getting Started
Install node dependencies:

    npm install

## Start the development server:

    npm start

    or (if need to set an environment):

    NODE_ENV=(development|development_acceptance) npm start


## Proxy

Navigate to:

    http://localhost:8333/

*NOTE*

  Because of "No 'Access-Control-Allow-Origin' header" (since this application has to query SOLR) to do anything meaningful
  you have to follow the connecting to SOLR directions below


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

## Connection to *acceptance* server

To connect to acceptance server, make a few ssh tunnels:

    [scholars] ssh -L 8082:localhost:8080 scholars-web-test-04.oit.duke.edu

    [solr] ssh -L 8081:localhost:8081 scholars-solr-test-01.oit.duke.edu

And add these lines to /etc/apache2/others/scholars.conf


  ProxyPass /orgs/ http://localhost:8082/
  ProxyPassReverse /orgs/ http://localhost:8082/

  ProxyPass /vivosolr/ http://localhost:8081/
  ProxyPassReverse /vivosolr/ http://localhost:8081/

  # those must come before this line
  ProxyPass / http://localhost:9080/
  ProxyPassReverse / http://localhost:9080/


## Tests
Testing is done with the [Karma]() test runner and the [Jasmine]() framework. Tests in this example are written with es6 syntax.

To run tests:

    npm run test

This will watch all files involved in the defined tests and automatically rebuild/test on save.
