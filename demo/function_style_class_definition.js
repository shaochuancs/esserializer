/**
 * Created by cshao on 2021-03-01.
 */

'use strict';

const ESSerializer = require('../dist/bundle');
const Person = require('./env/Person');

var p1 = new Person(42);
console.log("At the beginning, p1 is old: " + p1.isOld());

var serializedText = ESSerializer.serialize(p1);
var p1FromDeserialization = ESSerializer.deserialize(serializedText, [Person]);
console.log("After deserialization, p1 is old: " + p1FromDeserialization.isOld());