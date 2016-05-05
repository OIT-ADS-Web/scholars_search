require('dotenv').config();

import fetch from 'isomorphic-fetch'

// FIXME: how to do this?
//
// $ curl http://localhost/ROOTsolr/collection1/select -d '{query:"med*"}'

//var queryString = process.env.SOLR_URL // + JSON.stringify({ query:"hero" })

//var uri = "http://localhost/ROOTsolr/collection1/select"
//var uri = "http://localhost/ROOTsolr/collection1/select?wt=json&json="+JSON.stringify({query: 'med*'})
var uri = "http://localhost/ROOTsolr/collection1/select?wt=json"

// NOTE: this should work in theory (see https://github.com/github/fetch)
// but just returns "bad request (400)"

fetch(uri, {
  method: 'POST',  
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({query: 'med*'})
}).then(function(response) {
  console.log(response)
  console.log(response.json())
})

 
