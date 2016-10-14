// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

import _ from 'lodash'

import helper from '../src/utils/PagingHelper'


/*

[ [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] ]
[ [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] ]
[ [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] ]
[ [ 1, 2 ] ]

*/

function main() {
  console.log("***** 1. *******")

  let test1 = helper.pageArrays(15, 8)
  console.log(test1)

  let test2 = helper.pageArrays(15, 9)
  console.log(test2)

  let test3 = helper.pageArrays(15, 7)
  console.log(test3)

  let test4 = helper.pageArrays(2, 1)
  console.log(test4)


}

/*
 
[ [ '-' ],
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
  [ '+', 16 ] ]
[ [ '+', 1 ],
  [ 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 ],
  [ '+', 31 ] ]
[ [ '-' ],
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
  [ '+', 16 ] ]

*/
function main2() {
  console.log("***** 2. *******")
  
  let test1 = helper.pageArrays(100, 3)
  console.log(test1)

  let test2 = helper.pageArrays(100, 15)
  console.log(test2)

  let test3 = helper.pageArrays(100, 4)
  console.log(test3)

}

/*
 
[ [ '-' ],
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
  [ '+', 16 ] ]
[ [ '+', 46 ],
  [ 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75 ],
  [ '+', 76 ] ]
[ [ '+', 76 ], [ 91, 92, 93, 94 ], [ '-' ] ]

[ [ '-' ],
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
  [ '+', 16 ] ]
[ [ '+', 16 ],
  [ 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45 ],
  [ '+', 46 ] ]

*/
function main3() {
  console.log("***** 3. *******")

  
  let test1 = helper.pageArrays(95, 3)
  console.log(test1)

  let test2 = helper.pageArrays(95, 65)
  console.log(test2)

  let test3 = helper.pageArrays(95, 92)
  console.log(test3)

  // what if exactly matches PAGE_BY
  let test4 = helper.pageArrays(95, 15)
  console.log(test4)

  let test5 = helper.pageArrays(95, 45)
  console.log(test5)

}

main()
main2()
main3()

