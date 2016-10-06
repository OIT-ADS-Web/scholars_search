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
 
sample results

********* 8 of 15 *******
[ [ 1, 2, 3 ],
  '...',
  [ 5, 6, 7, 8 ],
  [ 9, 10, 11 ],
  '...',
  [ 13, 14, 15 ] ]
********* 9 of 15 *******
[ [ 1, 2, 3 ], '...', [ 9, 10, 11, 12, 13, 14, 15 ] ]
********* 7 of 15 *******
[ [ 1, 2, 3, 4, 5, 6, 7 ], '...', [ 13, 14, 15 ] ]

*/


function pageArrays(totalPages, currentPage) {

  let pageArray = _.range(1, totalPages + 1)

  let returnArray = []

  if (totalPages < 15) {
    returnArray.push(pageArray)
    return returnArray
  }

  let first3 = _.take(pageArray, 3)
  let last3 = _.takeRight(pageArray, 3)

  // example:
  // if total pages15 ...
  //
  //   if 7 or under only show 1-7 and 13,14,15
  //   if 9 or over only show 1,2,3 and 9-15
  //
  //console.log(first3)
  // e.g. 9 example
  if (currentPage >= (totalPages - 6)) {
 
    returnArray.push(first3)
 
    let beforeList = _.slice(pageArray, currentPage - 1, totalPages - 3)
    let lastList = beforeList.concat(last3)
    
    let middle = pageArray[Math.round((pageArray.length - 1) / 2)];
    let middle6 = _.range(middle - 3, middle + 3)

    returnArray.push(["..."])
    returnArray.push(middle6)
    returnArray.push(["..."])
    // ? middle 3 ??
    //
    returnArray.push(lastList)

  // e.g. 7 example
  } else if (currentPage <= 7) {
    
    let afterList = _.slice(pageArray, 3, currentPage)
    let beforeList = first3.concat(afterList)

    returnArray.push(beforeList)

    let middle = pageArray[Math.round((pageArray.length - 1) / 2)];
    let middle6 = _.range(middle - 3, middle + 3)

    returnArray.push(["..."])
    returnArray.push(middle6)
    returnArray.push(["..."])
    
    returnArray.push(last3)

  } else {

    returnArray.push(first3)

    let before = currentPage - 3
    let after = currentPage + 3

    let beforeList = _.slice(pageArray, before - 1, currentPage)
    let afterList = _.slice(pageArray, currentPage, after)

    returnArray.push(["..."])
    returnArray.push(beforeList)
    returnArray.push(afterList)
    returnArray.push(["..."])
    returnArray.push(last3)
  }

  return returnArray
}


export default { pageArrays }


