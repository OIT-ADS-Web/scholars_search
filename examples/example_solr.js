require('dotenv').config();

import fetch from 'isomorphic-fetch'

// FIXME: how to do this?
//
// $ curl http://localhost/ROOTsolr/collection1/select -d '{query:"med*"}'

//let queryString = process.env.SOLR_URL // + JSON.stringify({ query:"hero" })

//let uri = "http://localhost/ROOTsolr/collection1/select"
//let uri = "http://localhost/ROOTsolr/collection1/select?wt=json&json="+JSON.stringify({query: 'med*'})
let uri = "http://localhost/ROOTsolr/collection1/select?wt=json"

// NOTE: this should work in theory (see https://github.com/github/fetch)
// even though CURL works, fetch raises this:
//
// org.apache.solr.common.SolrException: Search requests cannot accept content streams
// someday it would be cool to use json as the query definition - "turtles all the way down"
fetch(uri, {
  method: 'post',  
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({'query': 'med*'})
}).then(function(response) {
  console.log(response)
  //console.log(response.json())
})

 
