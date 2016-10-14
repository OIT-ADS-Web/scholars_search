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
  > NODE_ENV=(development|acceptance_dev) npm start

  ```

(see below for other setup necessary to connect to acceptance server during development)

This will watch all files, rebuild and hot-load the running dev server code with your changes. No need to refresh the browser.

Navigate to:  

  http://localhost:8333


**NOTE**: you are more likely to want to use this (see 'Proxy' section for setup):

  http://localhost/scholars_search

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

then run this on the command line:

  ```
  > NODE_ENV=acceptance-dev npm start
  
  ```

You can switch the organizations list from local to acceptance too (that is waht the `/orgs` is for above).  But you also
have to ssh tunnel into web-test-04 as well.

This JSON comes from VIVO itself - as a path `/orgservice` (see productMods/WEB-INF/web.xml):

```
  <servlet>
    <servlet-name>Organization Service</servlet-name>
    <servlet-class>edu.cornell.mannlib.vitro.webapp.controller.OrganizationServiceServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>Organization Service</servlet-name>
    <url-pattern>/orgservice</url-pattern>
  </servlet-mapping>

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

  ```
  > npm run test

  ```

This will watch all files involved in the defined tests and automatically rebuild/test on save.


## Tabs

The tabs are setup in the *TabPicker* file.  The basic idea is each tab has a filter associated with it, and 
any number of facets to add to the base query.


Then each tab must have it's own class, that extends *Tab*.  This has various methods that can be overriden for
tab specific behaviour.  These are further divided into filterer, displayer, and downloader components.


### Filterer (things that are sent to SOLR to change the results)

* applyFilters

  This will, at the very least, apply the base_filter for a tab (which would typically be class:(Person) (for instance)


### Displayer (things that are REACT components  and meant for display)

* individualDisplay

  This is related to *results*.  The default *results* method calls this method and is returning a display per row - 
  which is defined in classes such as *PersonDisplay*.  Each of those extends *HasSolrData* - since they often share 
  the same basic information.

* facetDisplay
  
  This controls what shows up in the 'facets' section of the search results.  An example of how to use this is in 
  *OrganizationsFacets* (in the *tabs/OrganizationsTab.js* file.  The typical idea is you only have to return a 
  component that uses the mixin *HasFacets* and then set the actual facets in the constructor of the component 
  that #facetDisplay() returns e.g.:


  ```

    return (
      <OrganizationsFacets facet_fields={facet_fields} 
          chosen_facets={chosen_ids} 
          onFacetClick={callback} 
          context={data}/>      
    )
 
  
  ```
  
  then in the componet something like this:

  
  ```
  
  class OrganizationsFacets extends HasFacets(Component) {

    constructor(props) {
      super(props)
    
      this.onFacetClick = props.onFacetClick
      this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", label: "Type"}]
    }

  ```

  Then everything else falls into place.  

  **NOTE**: the *prefix* parameter is not self-explanatory.  It is necessary
  as a UI thing to give a checkbox an id.  So, for instance, if the prefix were "dept"
  the id for the checkbox might be dept\_org5000001.
  
  It is also used to separate out facet values to build the filter query - so there
  can be multiple facets per tab. 

  It could call be called 'tag', or 'differentiator' too.  Or even "namespace", because
  it is a way to group facet values that are returned.
 

### Downloader

* fields

  This adds fields to the default csv download, since each tab is a little different.  You can simply return a 
  `TabDownloader` with fields specified (instead of overriding `TabDownloader`).

 
## Examples

There are a series of scripts in the 'examples' subdirectory which you may or may not find instructional.  The idea is that each script exercises the
API of the application in some way.  So they can serve as examples or as exploratory bases of code from which to investigate.  Or starting points
for command-line driven debugging efforts etc... 

To run an example you need `babel-node` installed.  Then:

  ```
  > babel-node examples/example_[example].js

  ```


