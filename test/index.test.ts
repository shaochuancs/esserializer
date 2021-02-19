/**
 * Created by cshao on 2021-02-19.
 */


'use strict';

import SuperClassA from './env/SuperClassA';

const ESSerializer = require('../src/index');

import ClassA from './env/ClassA';
import ClassB from './env/ClassB';
import ClassC from './env/ClassC';

describe('Test serialize', () => {
  test('can serialize all fields of object', () => {
    const classAInstance = new ClassA();
    classAInstance.name = 'SmallTiger';
    const objectToBeSerialized = {
      name: 'Tiger',
      age: 42,
      sad: null,
      hate: undefined,
      live: true,
      son: classAInstance
    };
    const serializedTextExpected = '{\"name\":\"Tiger\",\"age\":42,\"sad\":null,\"live\":true,\"son\":{\"_size\":0,\"_name\":\"SmallTiger\",\"age\":28,\"className\":\"ClassA\"}}';
    expect(ESSerializer.serialize(objectToBeSerialized)).toStrictEqual(serializedTextExpected);
  });
});

describe('Test deserialize', () => {
  test('can deserialize complex text', () => {
    const serializedText = '{"_hobby":"football","className":"ClassB","toy":{"_height":29,"className":"ClassC"},"friends":[{"_name":"Old man","age":88,"className":"ClassA"},{"_height":54,"className":"ClassC"},"To be or not to be"]}';
    expect(ESSerializer.deserialize(serializedText, [SuperClassA, ClassA, ClassB, ClassC]).toy.height).toBe(29);
  });
});