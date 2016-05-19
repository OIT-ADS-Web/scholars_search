# scholars_search

## Getting Started
Install node dependencies:

    npm install

## Start the development server:

    ```
    > npm start
    
    ```

    or (if need to set an environment):


    ```
    > NODE_ENV=(development|development_acceptance) npm start
    
    ```

This will watch all files, rebuild and hot-load the running dev server code with your changes. No need to refresh the browser.

Navigate to:

    http://localhost:8333/


## Proxy


  **NOTE**

  Because of "No 'Access-Control-Allow-Origin' header" (since this application has to query SOLR) to do anything meaningful
  you have to follow the connecting to SOLR directions below

  Add these lines to the apache configuration (perhaps /etc/apache2/others/scholars.conf)

  ```
  ProxyPass /scholars_search/ http://localhost:8333/
  ProxyPassReverse /scholars_search/ http://localhost:8333/

  # this is for a local VIVO instance
  ProxyPass / http://localhost:9080/
  ProxyPassReverse / http://localhost:9080/

  ```

  This means you would now have to do this to connect (note trailing slash)

  http://localhost/scholars_search/


## Connecting to SOLR

  This uses two environmental variables to determine how to connect to Solr.  Those are initialized by `dotenv` by means
  of a file named from the `process.env.NODE_ENV` + `.env` (defaulting to `development.env`)  

  So to connect to another enviroment, you would run it like this:

  ```
  > NODE_ENV=acceptance npm start

  ```

## .env variables

    
  *SOLR_URL*
  
  example: "http://localhost/ROOTsolr/collection1/select"
  
  *ORG_URL*
  
  example: "http://localhost/orgservice?getIndex=1&uri=https://scholars.duke.edu/individual/org50000021"


## Connection to *acceptance* server during local development

Sometimes it's useful to see what would happen with the real data.  It's only a search so there is nothing
much destructive about that.

To connect to acceptance server, make a few ssh tunnels:

    ```
    [scholars] ssh -L 8082:localhost:8080 [acceptance-server-for-VIVO]

    [solr] ssh -L 8081:localhost:8081 [acceptance-server-for-solr]

    ```

And add these lines to /etc/apache2/others/scholars.conf


  ```
  ProxyPass /orgs/ http://localhost:8082/
  ProxyPassReverse /orgs/ http://localhost:8082/

  ProxyPass /vivosolr/ http://localhost:8081/
  ProxyPassReverse /vivosolr/ http://localhost:8081/

  # those must come before this line
  ProxyPass / http://localhost:9080/
  ProxyPassReverse / http://localhost:9080/

  ```
## Building and Deploying

  First run the build command - this puts something in the `./dist` folder.  *NOTE*: you have to do `npm run build` not just `npm build`
  
  ```
  NODE_ENV=(acceptance|production) npm run build
  ```

  Then there is a simple script that copies files.
  ```
  ./deploy.sh (acceptance|production)
  ```

## Tests
Testing is done with the [Karma]() test runner and the [Jasmine]() framework. Tests in this example are written with es6 syntax.

To run tests:

    npm run test

This will watch all files involved in the defined tests and automatically rebuild/test on save.


## Download

Results from Scholars@Duke for alejandro on 5/17/2016                           
Name     Title   Email   URI     VIVO Profile URL


Lacanian Analysis & the Naturalizations 
Project (Special Workshop) in relation to The Screams of Silence: Depression and Other Maladies of Modern Times, a visiting lecture by Alejandro Salamonovitz, PhD, International Exchange Program. September 20, 2008
https://scholars.duke.edu/individual/presentation31484  
/display/presentation31484

