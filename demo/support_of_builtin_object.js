/**
 * Created by cshao on 2021-02-23.
 * Node.js v15.0.0 is required to run all the demo program here.
 */

'use strict';

const ESSerializer = require('../dist/bundle');

Promise.any([
  Promise.reject(new Error("some error")),
]).catch(e => {
  console.log(e instanceof AggregateError); // true
  console.log(e.message);                   // "All Promises rejected"
  console.log(e.name);                      // "AggregateError"
  // console.log(e.errors);                    // [ Error: "some error" ]
});