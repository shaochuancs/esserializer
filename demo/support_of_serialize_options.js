/**
 * Created by cshao on 2021/12/19
 */

'use strict';

const ESSerializer = require('../dist/bundle');

const objToSerialize = {
  a: [13, 37],
  n: 42,
  unwantedField: 'This value should be removed during serialization'
};
const serializedText = ESSerializer.serialize(objToSerialize, {
  ignoreProperties: ['unwantedField'],
  interceptProperties: {
    n: function (value) {
      return value + this.a[0];
    }
  }
});
console.log(serializedText);
const deserializedObj = ESSerializer.deserialize(serializedText);
console.log(deserializedObj);
