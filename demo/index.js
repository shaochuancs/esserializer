/**
 * Created by cshao on 2019-05-23.
 */

'use strict';

const ESSerializer = require('../index');

const SuperA = require('./SuperA');
const A = require('./A');
const SubA = require('./SubA');
let classes = [SuperA, A, SubA];

let subAObj = new SubA({xVal: 666, zVal: 231});
console.log(subAObj);

let serializedString = ESSerializer.serialize(subAObj);
console.log(serializedString);

let deserializedObj = ESSerializer.deserialize(serializedString, classes);
console.log(deserializedObj);

deserializedObj.methodOfSuperA();