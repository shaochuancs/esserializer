/**
 * Created by cshao on 2021/12/22
 */

'use strict';

const ESSerializer = require('../dist/bundle');
const User = require('./env/User');

const user = new User('P123456', 'Mike');
console.log(user);
const serializedString = ESSerializer.serialize(user);
const deserializedObj = ESSerializer.deserialize(serializedString, [User], {
  fieldsForConstructorParameters: ['id', 'name']
});
console.log(deserializedObj);

const text = '{"user":"Alice","data":{"row":1234,"column":21,"url":"https://example.com"}}';
const propertyIgnoredResult = ESSerializer.deserialize(text, [], {
  ignoreProperties: ['data']
});
console.log(propertyIgnoredResult);
const propertyRawResult = ESSerializer.deserialize(text, [], {
  rawProperties: ['data']
});
console.log(propertyRawResult);
