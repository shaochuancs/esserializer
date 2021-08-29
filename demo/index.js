/**
 * Created by cshao on 2021-08-29.
 */

'use strict';

const ESSerializer = require('../dist/bundle');
const Person = require('./env/Person');
const MyObject = require('./env/MyObject');

// -------- support array as root --------

const arr = [{a:88}, {b:42}];

const s = ESSerializer.serialize(arr);
console.log(s);

const o = ESSerializer.deserialize(s);
console.log(o);

const arr2 = [new Person(88), new MyObject()];

const s2 = ESSerializer.serialize(arr2);
console.log(s2);

const o2 = ESSerializer.deserialize(s2, [Person, MyObject]);
console.log(o2);