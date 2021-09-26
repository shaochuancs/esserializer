/**
 * Created by cshao on 2021-02-19.
 */


'use strict';

import SuperClassA from './env/SuperClassA';

const ESSerializer = require('../src/index');

import ClassA from './env/ClassA';
import ClassB from './env/ClassB';
import ClassC from './env/ClassC';
import MyObject from './env/MyObject';
import Person from './env/Person';

describe('Test serialize', () => {
  test('can serialize all fields of object', () => {
    const classAInstance = new ClassA();
    classAInstance.name = 'SmallTiger';
    const objectToBeSerialized = {
      name: 'Tiger',
      age: 42,
      sad: null,
      live: true,
      son: classAInstance
    };
    const serializedTextExpected = '{\"name\":\"Tiger\",\"age\":42,\"sad\":null,\"live\":true,\"son\":{\"_size\":0,\"_name\":\"SmallTiger\",\"age\":28,\"ess_cn\":\"ClassA\"}}';
    expect(ESSerializer.serialize(objectToBeSerialized)).toStrictEqual(serializedTextExpected);
  });

  test('can serialize function style class definition', () => {
    expect(ESSerializer.serialize(new Person(38))).toStrictEqual('{\"age\":38,\"ess_cn\":\"Person\"}');
  });

  test('can serialize prototype function style class definition', () => {
    expect(ESSerializer.serialize(new MyObject())).toStrictEqual('{\"property1\":\"First\",\"property2\":\"Second\",\"ess_cn\":\"MyObject\"}');
  });
});

describe('Test deserialize', () => {
  test('can deserialize array', () => {
    const serializedText = '[{"age":88,"ess_cn":"Person"},{"property1":"First","property2":"Second","ess_cn":"MyObject"}]';
    expect(Array.isArray(ESSerializer.deserialize(serializedText, [Person, MyObject]))).toBe(true);
  });

  test('can deserialize complex text', () => {
    const serializedText = '{"_hobby":"football","ess_cn":"ClassB","toy":{"_height":29,"ess_cn":"ClassC"},"friends":[{"_name":"Old man","age":88,"ess_cn":"ClassA"},{"_height":54,"ess_cn":"ClassC"},"To be or not to be"]}';
    expect(ESSerializer.deserialize(serializedText, [SuperClassA, ClassA, ClassB, ClassC]).toy.height).toBe(29);
  });

  test('can throw meaningful exception if class is missing', () => {
    const serializedText = '{"_hobby":"football","ess_cn":"ClassB","toy":{"_height":29,"ess_cn":"ClassC"},"friends":[{"_name":"Old man","age":88,"ess_cn":"ClassA"},{"_height":54,"ess_cn":"ClassC"},"To be or not to be"]}';
    expect(() => {
      ESSerializer.deserialize(serializedText, [SuperClassA, ClassA, ClassB]);
    }).toThrow('Class ClassC not found');
  });

  test('can deserialize for function style class definition', () => {
    const serializedText = '{"age":77,"ess_cn":"Person"}';
    expect(ESSerializer.deserialize(serializedText, [Person]).isOld()).toBe(true);
  });

  test('can deserialize for prototype function style class definition', () => {
    const serializedText = '{\"property1\":\"One\",\"property2\":\"Two\",\"ess_cn\":\"MyObject\"}';
    expect(ESSerializer.deserialize(serializedText, [MyObject]).isInitialized()).toBe(true);
  });

  test('can serialize and deserialize Infinity', () => {
    const objToSerialize = {i: Infinity, ni: -Infinity};
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).i).toBe(Infinity);
    expect(ESSerializer.deserialize(serializedText).ni).toBe(-Infinity);
  });

  test('can serialize and deserialize NaN', () => {
    const objToSerialize = {nan: NaN};
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).nan).toBe(NaN);
  });

  test('can serialize and deserialize undefined', () => {
    const objToSerialize = {u: undefined};
    const serializedText = ESSerializer.serialize(objToSerialize);
    const deserializedObj = ESSerializer.deserialize(serializedText);
    expect(Object.keys(deserializedObj).includes('u')).toBe(true);
    expect(deserializedObj.u).toBe(undefined);
  });

  test('can serialize and deserialize Boolean wrapper object', () => {
    const objToSerialize = {
      f: new Boolean(false),
      t: new Boolean(true)
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    const deserializedObj = ESSerializer.deserialize(serializedText);
    expect(deserializedObj.f).toStrictEqual(new Boolean(false));
    expect(deserializedObj.t).toStrictEqual(new Boolean(true));
  });

  test('can serialize and deserialize Error object', () => {
    const objToSerialize = {
      e: new Error(),
      e2: new Error('unexpected')
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    const deserializedObj = ESSerializer.deserialize(serializedText);
    expect(deserializedObj.e.name).toBe('Error');
    expect(deserializedObj.e2.message).toBe('unexpected');
  });

  test('can serialize and deserialize EvalError object', () => {
    const objToSerialize = {
      e: new EvalError('Failed to parse')
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    const deserializedObj = ESSerializer.deserialize(serializedText);
    expect(deserializedObj.e.message).toBe('Failed to parse');
  });

  test('can serialize and deserialize RangeError object', () => {
    const objToSerialize = {
      e: new RangeError('Invalid input'),
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    const deserializedObj = ESSerializer.deserialize(serializedText);
    expect(deserializedObj.e.message).toBe('Invalid input');
  });

  test('can serialize and deserialize ReferenceError object', () => {
    let error;
    try {
      // @ts-ignore
      let a = undefinedVariable;
    } catch (e) {
      error = e;
    }
    const objToSerialize = {
      e: error
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    const deserializedObj = ESSerializer.deserialize(serializedText);
    expect(deserializedObj.e.name).toBe('ReferenceError');
  });

  test('can serialize and deserialize SyntaxError object', () => {
    let error;
    try {
      eval('foo bar');
    } catch (e) {
      error = e;
    }
    const objToSerialize = {
      e: error
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    const deserializedObj = ESSerializer.deserialize(serializedText);
    expect(deserializedObj.e.message).toBe('Unexpected identifier');
  });

  test('can serialize and deserialize TypeError object', () => {
    let error;
    try {
      // @ts-ignore
      null.f();
    } catch (e) {
      error = e;
    }
    const objToSerialize = {
      e: error
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    const deserializedObj = ESSerializer.deserialize(serializedText);
    expect(deserializedObj.e.name).toBe('TypeError');
  });

  test('can serialize and deserialize URIError object', () => {
    let error;
    try {
      decodeURIComponent('%')
    } catch (e) {
      error = e;
    }
    const objToSerialize = {
      e: error
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    const deserializedObj = ESSerializer.deserialize(serializedText);
    expect(deserializedObj.e.message).toBe('URI malformed');
  });

  test('can serialize and deserialize AggregateError object', (done) => {
    // @ts-ignore
    Promise.any([
      Promise.reject(new Error("find a bug")),
      Promise.reject(new TypeError("Invalid type")),
    ]).catch(e => {
      const objToSerialize = {
        e: e
      };
      const serializedText = ESSerializer.serialize(objToSerialize);
      const deserializedObj = ESSerializer.deserialize(serializedText);
      expect(deserializedObj.e.stack).toBe('AggregateError: All promises were rejected');
      expect(deserializedObj.e.errors[0].message).toBe('find a bug');
      expect(deserializedObj.e.errors[1].message).toBe('Invalid type');
      done();
    });
  });

  test('can serialize and deserialize BigInt', () => {
    const objToSerialize = {
      // @ts-ignore
      bi: 12345678987654321n,
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    // @ts-ignore
    expect(ESSerializer.deserialize(serializedText).bi).toBe(12345678987654321n);
  });

  test('can serialize and deserialize String wrapper object', () => {
    const objToSerialize = {
      s: new String('text')
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).s).toStrictEqual(new String('text'));
  });

  test('can serialize and deserialize Regular Expression', () => {
    const objToSerialize = {
      re: /ab+c/i
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).re).toStrictEqual(/ab+c/i);
  });

  test('can serialize and deserialize Int8Array', () => {
    const objToSerialize = {
      a: new Int8Array([29, 42])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new Int8Array([29, 42]));
  });

  test('can serialize and deserialize Uint8Array', () => {
    const objToSerialize = {
      a: new Uint8Array([29, 42])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new Uint8Array([29, 42]));
  });

  test('can serialize and deserialize Uint8ClampedArray', () => {
    const objToSerialize = {
      a: new Uint8ClampedArray([29, 42])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new Uint8ClampedArray([29, 42]));
  });

  test('can serialize and deserialize Int16Array', () => {
    const objToSerialize = {
      a: new Int16Array([29, 42])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new Int16Array([29, 42]));
  });

  test('can serialize and deserialize Uint16Array', () => {
    const objToSerialize = {
      a: new Uint16Array([29, 42])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new Uint16Array([29, 42]));
  });

  test('can serialize and deserialize Int32Array', () => {
    const objToSerialize = {
      a: new Int32Array([29, 42])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new Int32Array([29, 42]));
  });

  test('can serialize and deserialize Uint32Array', () => {
    const objToSerialize = {
      a: new Uint32Array([29, 42])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new Uint32Array([29, 42]));
  });

  test('can serialize and deserialize Float32Array', () => {
    const objToSerialize = {
      a: new Float32Array([29, 42])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new Float32Array([29, 42]));
  });

  test('can serialize and deserialize Float64Array', () => {
    const objToSerialize = {
      a: new Float64Array([29, 42])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new Float64Array([29, 42]));
  });

  test('can serialize and deserialize BigInt64Array', () => {
    const objToSerialize = {
      // @ts-ignore
      a: new BigInt64Array([29n, 42n])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    // @ts-ignore
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new BigInt64Array([29n, 42n]));
  });

  test('can serialize and deserialize BigUint64Array', () => {
    const objToSerialize = {
      // @ts-ignore
      a: new BigUint64Array([29n, 42n])
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    // @ts-ignore
    expect(ESSerializer.deserialize(serializedText).a).toStrictEqual(new BigUint64Array([29n, 42n]));
  });

  test('can serialize and deserialize Set', () => {
    const objToSerialize = {
      set: new Set([42, 55, 55, 'Hello', {a: 1, b: 2}, {a: 1, b: 2}]),
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).set).toStrictEqual(new Set([42, 55, 'Hello', {a: 1, b: 2}, {a: 1, b: 2}]));
  });

  test('can serialize and deserialize ArrayBuffer', () => {
    const arrayBuffer = new ArrayBuffer(8);
    const bufferView = new Int32Array(arrayBuffer);
    bufferView[0] = 9876543210;
    const objToSerialize = {
      bf: arrayBuffer
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).bf).toStrictEqual(arrayBuffer);
  });

  test('can serialize and deserialize SharedArrayBuffer', () => {
    const sab = new SharedArrayBuffer(1024);
    const sabView = new Int32Array(sab);
    sabView[0] = 123456789;
    const objToSerialize = {
      sab: sab
    };
    const serializedText = ESSerializer.serialize(objToSerialize);
    expect(ESSerializer.deserialize(serializedText).sab).toStrictEqual(sab);
  });
});
