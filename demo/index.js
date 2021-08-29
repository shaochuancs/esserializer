/**
 * Created by cshao on 2021-08-29.
 */

'use strict';

const ESSerializer = require('../dist/bundle');

// -------- support root array --------

const arr = [{a:88}, {b:42}];

const s = ESSerializer.serialize(arr);
console.log(s);

const o = ESSerializer.deserialize(s);
console.log(o);