// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

//http://www.2ality.com/2015/03/es6-generators.html
/**
 * Returns a function that, when called,
 * returns a generator object that is immediately
 * ready for input via `next()`
 */
function coroutine(generatorFunction) {
    return function (...args) {
        let generatorObject = generatorFunction(...args);
        generatorObject.next();
        return generatorObject;
    };
}

let testFunction = function*() {
  let id = yield
  console.log(`${id} world`)
}

let origFun = testFunction()
origFun.next()
origFun.next("hello...")

const testGenerator = coroutine(testFunction)

let coFunction = testGenerator()
coFunction.next("hello...")


// NOTE: can't send parameters to the next() call
// when used in a for loop (as near as I can tell)
let testFunction2 = function*(id) {
  yield `1. hello... ${id}`
  yield `2. hello... ${id}`
  yield `3. hello... ${id}`
}

for(let n of testFunction2("world")) {
  console.log(n)
}


let testFunction3 = function*(fn) {
  yield fn()
}

testFunction3(function() { 
    console.log("Hello")
    console.log("World") 
}).next()

// this works - but it's abusing the 
// for-loop construct
for(let x of testFunction3(function() { 
  console.log("HELLO")
  console.log("WORLD")
})) { }


// was hoping this would work
// (i.e. without the next())
//
// testFunction3(function() {
//  console.log("hello")
// })
//
//
