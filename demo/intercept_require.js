/**
 * Created by cshao on 2021-09-30.
 */

'use strict';

const ESSerializer = require('../dist/bundle');
ESSerializer.interceptRequire();

const SubClassA = require('./env/SubClassA');

let subAObj = new SubClassA({xVal: 666, zVal: 231});
subAObj.age = 42;
subAObj.weight = 88;
subAObj.height = 90;

let serializedString = ESSerializer.serialize(subAObj);
console.log(serializedString);

console.log('--------');

let deserializedObj = ESSerializer.deserialize(serializedString);
console.log(deserializedObj);
console.log(deserializedObj instanceof SubClassA);

console.log(deserializedObj.age);
console.log(deserializedObj.height);

deserializedObj.methodOfSuperClassA();
deserializedObj.staticMethodOfSubClassA();
