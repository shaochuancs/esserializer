/**
 * Created by cshao on 2021-08-29.
 */

'use strict';

const ESSerializer = require('../dist/bundle');
const Person = require('./env/Person');
const MyObject = require('./env/MyObject');

const arrayBuffer = new ArrayBuffer(8);
const bufferView = new Int32Array(arrayBuffer);
bufferView[0] = 9876543210;

const sab = new SharedArrayBuffer(1024);
const sabView = new Int32Array(sab);
sabView[0] = 123456789;

const arrayBuffer2 = new ArrayBuffer(16);
const dataView = new DataView(arrayBuffer2);
dataView.setInt16(1, 42);

const objToSerialize = {
  a: [13, 37],
  a2: new Int8Array([29, 42]),
  a3: new Uint8Array([29, 42]),
  a4: new Uint8ClampedArray([29, 42]),
  a5: new Int16Array([29, 42]),
  a6: new Uint16Array([29, 42]),
  a7: new Int32Array([29, 42]),
  a8: new Uint32Array([29, 42]),
  a9: new Float32Array([29, 42]),
  a10: new Float64Array([29, 42]),
  a11: new BigInt64Array([29n, 42n]),
  a12: new BigUint64Array([29n, 42n]),
  b: false,
  b2: new Boolean(false),
  bf: arrayBuffer,
  bi: 12345678987654321n,
  d: new Date(),
  dv: dataView,
  e: new Error('unexpected exception'),
  ic: new Intl.Collator('de', {sensitivity: 'base'}),
  idtf: new Intl.DateTimeFormat('de-DE', {weekday: 'long'}),
  ilf: new Intl.ListFormat('en-GB', { style: 'long', type: 'conjunction' }),
  inf: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
  ipr: new Intl.PluralRules('ar-EG'),
  irtf: new Intl.RelativeTimeFormat('zh', { style: 'narrow' }),
  n: 42,
  re: /ab+c/i,
  s: 'text',
  s2: new String('text2'),
  sab: sab,
  set: new Set([42, 55, 55, 'Hello', {a: 1, b: 2}, {a: 1, b: 2}]),
  i: Infinity,
  nan: NaN,
  u: undefined
};
const serializedText = ESSerializer.serialize(objToSerialize);
console.log(serializedText);
const deserializedObj = ESSerializer.deserialize(serializedText);
console.log(deserializedObj);

// -------- support array as root --------

const arr = [{a:88}, {b:42}];

const s = ESSerializer.serialize(arr);
console.log(s);

const o = ESSerializer.deserialize(s);
console.log(o);

const arr2 = [new Person(88), new MyObject()];

const s2 = ESSerializer.serialize(arr2);
console.log(s2);

const o2 = ESSerializer.deserialize(s2, [Person, MyObject]);
console.log(o2);

// -------- support Date as root --------

const d = new Date();
const serializedD = ESSerializer.serialize(d);
console.log(serializedD);

const deserializedD = ESSerializer.deserialize(serializedD);
console.log(deserializedD);
