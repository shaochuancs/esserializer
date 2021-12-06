/**
 * Created by cshao on 2021/12/6
 */

'use strict';

const ESSerializer = require('../dist/bundle');
const User = require('./env/User');

const user = new User('P123456');
user.location = 'Zhejiang_Ningbo';
console.log(user);

const serializedString = ESSerializer.serialize(user);
const deserializedObj = ESSerializer.deserialize(serializedString, [User]);

console.log(deserializedObj);
