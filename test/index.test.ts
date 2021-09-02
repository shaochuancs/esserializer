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

  // test('can serialize and deserialize Infinity', () => {
  //   const objToSerialize = {i: Infinity, ni: -Infinity};
  //   const serializedText = ESSerializer.serialize(objToSerialize);
  //   expect(ESSerializer.deserialize(serializedText).i).toBe(Infinity);
  //   expect(ESSerializer.deserialize(serializedText).ni).toBe(-Infinity);
  // });
  //
  // test('can serialize and deserialize NaN', () => {
  //   const objToSerialize = {nan: NaN};
  //   const serializedText = ESSerializer.serialize(objToSerialize);
  //   expect(ESSerializer.deserialize(serializedText).nan).toBe(NaN);
  // });

  test('can serialize and deserialize undefined', () => {
    const objToSerialize = {u: undefined};
    const serializedText = ESSerializer.serialize(objToSerialize);
    const deserializedObj = ESSerializer.deserialize(serializedText);
    expect(Object.keys(deserializedObj).includes('u')).toBe(true);
    expect(deserializedObj.u).toBe(undefined);
  });
});