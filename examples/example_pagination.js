// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

import _ from 'lodash'

// needs to be a limit of 10 ? or something else?
// http://ux.stackexchange.com/questions/4127/design-suggestion-for-pagination-with-a-large-number-of-pages
//
// I prefer to use smart truncation to display the most helpful page links. In other words, 
// I show the first 3, ..., the current page with a padding of 3 (3 on either side), 
// another ..., then the last 3. With a lot of pages, the links above the list look 
// like this (the mouse is hovering over 56):

/*
// 1,2,3  ... 5,6,7,8,9,10,11 ... 13,14,15
 
********* 8 of 15 *******
[ 1, 2, 3 ]
[ 5, 6, 7, 8 ]
[ 9, 10, 11 ]
[ 13, 14, 15 ]
********* 9 of 15 *******
[ 1, 2, 3 ]
[ 9, 10, 11, 12 ]
[ 13, 14, 15 ]
********* 7 of 15 *******
[ 1, 2, 3 ]
[ 4, 5, 6, 7 ]
[ 13, 14, 15 ]
*/

function pageArrays(totalPages, currentPage) {
  console.log(`********* ${currentPage} of ${totalPages} *******`)

  let pageArray = _.range(1, totalPages + 1)

  let first3 = _.take(pageArray, 3)
  let last3 = _.takeRight(pageArray, 3)

  // example:
  // if total pages15 ...
  //
  //   if 7 or under only show 1-7 and 13,14,15
  //   if 9 or over only show 1,2,3 and 9-15
  //
  //console.log(first3)
  
  if (currentPage >= (totalPages - 6)) {
 
    console.log(first3)
 
    //let previous = currentPage - 3
    let beforeList = _.slice(pageArray, currentPage - 1, totalPages - 3)
    //console.log(beforeList) 
    //console.log(last3)
    let lastList = beforeList.concat(last3)
    console.log(lastList)

    //return first3, lastList


  } else if (currentPage <= 7) {
    
    let afterList = _.slice(pageArray, 3, currentPage)
    let beforeList = first3.concat(afterList)

    console.log(beforeList)
    console.log(last3)

  } else {

    console.log(first3)

    let before = currentPage - 3
    let after = currentPage + 3

    let beforeList = _.slice(pageArray, before - 1, currentPage)
    let afterList = _.slice(pageArray, currentPage, after)

    console.log(beforeList)
    console.log(afterList)
 
    console.log(last3) 
  }


}

function main() {
  pageArrays(15, 8)

  pageArrays(15, 9)
  
  pageArrays(15, 7)
}


main()

