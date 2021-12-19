/**
 * Created by cshao on 2021-08-29.
 */

'use strict';

const ESSerializer = require('../dist/bundle');
const ClassA = require('./env/ClassA');

const classAObj = new ClassA();

const serializedText = ESSerializer.serialize(classAObj);
console.log(serializedText);

const deserializedObj = ESSerializer.deserialize(serializedText, [ClassA]);
deserializedObj.methodOfClassA();




