/**
 * Created by cshao on 2021-10-24.
 */

'use strict';

const ESSerializer = require('../dist/bundle');

const Person = require('./env/Person');

const SuperClassA = require('./env/SuperClassA');
const ClassA = require('./env/ClassA');
const SubClassA = require('./env/SubClassA');

const AnotherClassA = require('./env/other/ClassA');

ESSerializer.registerClasses([Person, SuperClassA, ClassA, SubClassA]);

const p = new Person(88);
const serializedP = ESSerializer.serialize(p);
const deserializedP = ESSerializer.deserialize(serializedP);
console.log(deserializedP.isOld());

const subAObj = new SubClassA({xVal: 666, zVal: 231});
subAObj.age = 42;
subAObj.weight = 88;
subAObj.height = 90;
const serializedString = ESSerializer.serialize(subAObj);
const deserializedObj = ESSerializer.deserialize(serializedString);
console.log(deserializedObj);
deserializedObj.methodOfSuperClassA();

ESSerializer.deserialize(serializedString, [AnotherClassA]);
