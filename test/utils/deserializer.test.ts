/**
 * Created by cshao on 2021-02-19.
 */


'use strict';

import {
  deserializeFromParsedObj,
  deserializeFromParsedObjWithClassMapping,
  getClassMappingFromClassArray,
  getParentClassName,
  getProtoFromClassObj
} from '../../src/utils/deserializer';

import SuperClassA from '../env/SuperClassA';
import ClassA from '../env/ClassA';
import ClassB from '../env/ClassB';
import ClassC from '../env/ClassC';

const classMapping = {
  SuperClassA: SuperClassA,
  ClassA: ClassA,
  ClassB: ClassB,
  ClassC: ClassC
};
const simpleParsedObj = {
  age: 42,
  className: 'ClassA'
};
const complexParsedObj = {
  _hobby: 'football',
  className: 'ClassB',
  toy: {
    _height: 29,
    className: 'ClassC'
  },
  friends: [{
    _name: 'Old man',
    age: 88,
    className: 'ClassA'
  }, {
    _height: 54,
    className: 'ClassC'
  }, 'To be or not to be']
};

const parsedObjWithDateFieldValue = {
  id: 1,
  date: {
    className: 'Date',
    timestamp: 1613694240000
  }
};

describe('Test getClassMappingFromClassArray', () => {
  test('can generate class mapping object', () => {
    expect(getClassMappingFromClassArray([ClassA, ClassB])).toStrictEqual({
      ClassA: ClassA,
      ClassB: ClassB,
      Date: Date
    });
  });

  test('can generate class mapping object and omit non-class member', () => {
    expect(getClassMappingFromClassArray([ClassA, ClassB, {name: 'Candy'}])).toStrictEqual({
      ClassA: ClassA,
      ClassB: ClassB,
      Date: Date
    });
  });
});

describe('Test getParentClassName', () => {
  test('can get parent class name, if it exists', () => {
    expect(getParentClassName(ClassA)).toBe('SuperClassA');
  });

  test('will return Object as parent class name, if no custom super class is defined', () => {
    expect(getParentClassName(ClassB)).toBe('Object');
  });
});

describe('Test getProtoFromClassObj', () => {
  const protoOfClassA = getProtoFromClassObj(ClassA, classMapping);
  const protoOfClassB = getProtoFromClassObj(ClassB, classMapping);

  test('will compose constructor correctly', () => {
    expect(protoOfClassB.constructor).toBe(ClassB);
  });

  test('will compose __proto__ if custom super class exists', () => {
    // @ts-ignore
    expect(protoOfClassA.__proto__).toStrictEqual({
      constructor: SuperClassA
    });
  });

  test('will retain instance method of class', () => {
    // @ts-ignore
    expect(protoOfClassA.getAge).toBe(ClassA.prototype.getAge);
  });

  test('support getter and setter', () => {
    const namePropertyDescriptorInProtoOfClassA = Object.getOwnPropertyDescriptor(protoOfClassA, 'name');
    const namePropertyDescriptorRetrievedFromClassA = Object.getOwnPropertyDescriptor(ClassA.prototype, 'name');
    expect(namePropertyDescriptorInProtoOfClassA.get).toBe(namePropertyDescriptorRetrievedFromClassA.get);
    expect(namePropertyDescriptorInProtoOfClassA.set).toBe(namePropertyDescriptorRetrievedFromClassA.set);
  });
});

describe('Test deserializeFromParsedObjWithClassMapping', () => {
  const deserializedValueForNoneObject = deserializeFromParsedObjWithClassMapping(42, classMapping);
  const deserializedValueForSimpleObject = deserializeFromParsedObjWithClassMapping(simpleParsedObj, classMapping);
  const deserializedValueForComplexObject = deserializeFromParsedObjWithClassMapping(complexParsedObj, classMapping);

  test('will return parsedObj as it is if it\'s not an object', () => {
    expect(deserializedValueForNoneObject).toBe(42);
  });

  test('will recognize the prototype chain of instance', () => {
    expect(deserializedValueForSimpleObject.getAge).toBe(ClassA.prototype.getAge);
  });

  test('will retain instance property', () => {
    expect(deserializedValueForSimpleObject.age).toBe(42);
  });

  test('will retain instance property whose value is another class instance', () => {
    expect(deserializedValueForComplexObject.toy.height).toBe(29);
  });

  test('will deserialize array correctly', () => {
    expect(deserializedValueForComplexObject.friends[0].name).toBe('Old man');
    expect(deserializedValueForComplexObject.friends[1].height).toBe(54);
    expect(deserializedValueForComplexObject.friends[2]).toBe('To be or not to be');
  });
});

describe('Test deserializeFromParsedObj', () => {
  test('will deserialize complex object successfully', () => {
    const deserializedValueForComplexObject = deserializeFromParsedObj(complexParsedObj, [SuperClassA, ClassA, ClassB, ClassC]);
    expect(deserializedValueForComplexObject.toy.height).toBe(29);
  });

  test('will deserialize object with Date field value', () => {
    const deserializedValueForObjWithDateFieldValue = deserializeFromParsedObj(parsedObjWithDateFieldValue);
    expect(deserializedValueForObjWithDateFieldValue.date).toStrictEqual(new Date('2021-02-19T08:24:00'));
  });
});