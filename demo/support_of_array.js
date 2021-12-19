/**
 * Created by cshao on 2021/12/19
 */

'use strict';

const ESSerializer = require('../dist/bundle');
const Person = require('./env/Person');
const ClassA = require('./env/ClassA');

// -------- support array as root --------

const arr = [{a:88}, {b:42}];

const s = ESSerializer.serialize(arr);
console.log(s);

const o = ESSerializer.deserialize(s);
console.log(o);

const arr2 = [new Person(88), new ClassA()];

const s2 = ESSerializer.serialize(arr2);
console.log(s2);

const o2 = ESSerializer.deserialize(s2, [Person, ClassA]);
console.log(o2);
