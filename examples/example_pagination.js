// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

import _ from 'lodash'

/* NOTE: see PagingHelper - the idea is  we want
 * paging to look like this:
 *
 * 
// 1,2,3  ... 5,6,7,8,9,10,11 ... 13,14,15
// e.g first 3 pages, or last 3 pages
// or 3 before and 3 after current page
//
//
********* 8 of 15 *******
[ 1, 2, 3 ]
[...]
[ 5, 6, 7, 8 ]
[ 9, 10, 11 ]
[...]
[ 13, 14, 15 ]
********* 9 of 15 *******
[ 1, 2, 3 ]
[...]
[ 9, 10, 11, 12 ]
[ 13, 14, 15 ]
********* 7 of 15 *******
[ 1, 2, 3 ]
[ 4, 5, 6, 7 ]
[...]
[ 13, 14, 15 ]
*/

import helper from '../src/utils/PagingHelper'


// e.g. totalPages, currentPage parameters
//
function main() {
  let test1 = helper.pageArrays(15, 8)
  console.log(test1)

  let test2 = helper.pageArrays(15, 9)
  console.log(test2)

  let test3 = helper.pageArrays(15, 7)
  console.log(test3)

  let test4 = helper.pageArrays(2, 1)
  console.log(test4)


}


function main2() {
  let test1 = helper.pageArrays(100, 3)
  console.log(test1)


  let test2 = helper.pageArrays(100, 15)
  console.log(test2)

  let test3 = helper.pageArrays(100, 4)
  console.log(test3)



}

main2()

