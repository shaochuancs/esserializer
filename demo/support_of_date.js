/**
 * Created by cshao on 2021/12/19
 */

'use strict';

const ESSerializer = require('../dist/bundle');

// -------- support Date as root --------

const d = new Date();
const serializedD = ESSerializer.serialize(d);
console.log(serializedD);

const deserializedD = ESSerializer.deserialize(serializedD);
console.log(deserializedD);

