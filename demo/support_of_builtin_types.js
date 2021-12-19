/**
 * Created by cshao on 2021-02-23.
 * Node.js v15.0.0 is required to run all the demo program here.
 */

'use strict';

const ESSerializer = require('../dist/bundle');

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
  il: new Intl.Locale("zh-CN", {hourCycle: "h12"}),
  ilf: new Intl.ListFormat('en-GB', { style: 'long', type: 'conjunction' }),
  inf: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
  ipr: new Intl.PluralRules('ar-EG'),
  irtf: new Intl.RelativeTimeFormat('zh', { style: 'narrow' }),
  n: 42,
  n2: null,
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
