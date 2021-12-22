/**
 * Created by cshao on 2021-02-19.
 */


'use strict';

import {
  deserializeFromParsedObj,
  deserializeFromParsedObjWithClassMapping,
  getClassMappingFromClassArray,
  getParentClassName
} from '../../src/utils/deserializer';

import SuperClassA from '../env/SuperClassA';
import ClassA from '../env/ClassA';
import AnotherClassA from '../env/other/ClassA';
import ClassB from '../env/ClassB';
import ClassC from '../env/ClassC';
import Person from '../env/Person';

const classMapping = {
  SuperClassA: SuperClassA,
  ClassA: ClassA,
  ClassB: ClassB,
  ClassC: ClassC
};
const classPersonMapping = {
  Person: Person
};
const simpleParsedObj = {
  age: 42,
  ess_cn: 'ClassA'
};
const complexParsedObj = {
  _hobby: 'football',
  ess_cn: 'ClassB',
  toy: {
    _height: 29,
    ess_cn: 'ClassC'
  },
  friends: [{
    _name: 'Old man',
    age: 88,
    ess_cn: 'ClassA'
  }, {
    _height: 54,
    ess_cn: 'ClassC'
  }, 'To be or not to be']
};

const parsedObjWithDateFieldValue = {
  id: 1,
  date: {
    ess_cn: 'Date',
    ess_ts: 1613723040000
  }
};

const parsedObjWithInvalidDateFieldValue = {
  id: 1,
  date: {
    ess_cn: 'Date',
    ess_ts: 'invalid timestamp'
  }
};

describe('Test getClassMappingFromClassArray', () => {
  test('can generate class mapping object', () => {
    expect(getClassMappingFromClassArray([ClassA, ClassB])).toStrictEqual({
      ClassA: ClassA,
      ClassB: ClassB
    });
  });

  test('can generate class mapping object and omit non-class member', () => {
    expect(getClassMappingFromClassArray([ClassA, ClassB, {name: 'Candy'}])).toStrictEqual({
      ClassA: ClassA,
      ClassB: ClassB
    });
  });

  test('not display warning if duplicate class definition is passed', () => {
    const warn = jest.spyOn(global.console, 'warn');
    getClassMappingFromClassArray([ClassA, ClassB, ClassA]);
    expect(warn).not.toHaveBeenCalled();
  });

  test('can display warning if class definition with the same name are passed', () => {
    const warn = jest.spyOn(global.console, 'warn');
    getClassMappingFromClassArray([ClassA, ClassB, AnotherClassA]);
    expect(warn).toHaveBeenCalled();
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

describe('Test deserializeFromParsedObjWithClassMapping', () => {
  const deserializedValueForBooleanObject = deserializeFromParsedObjWithClassMapping({ess_cn: 'Boolean', ess_bool: false}, {});
  const deserializedValueForErrorObject = deserializeFromParsedObjWithClassMapping({ess_cn: 'Error', name: 'UnexpectedError', message: 'a nightmare'}, {});
  const deserializedValueForNotFinite = deserializeFromParsedObjWithClassMapping({ess_cn: 'NF', ess_str: 'Infinity'}, {});
  const deserializedValueForUndefined = deserializeFromParsedObjWithClassMapping({ess_cn: 'UD'}, {});
  const deserializedValueForNoneObject = deserializeFromParsedObjWithClassMapping(42, classMapping);
  const deserializedValueForSimpleObject = deserializeFromParsedObjWithClassMapping(simpleParsedObj, classMapping);
  const deserializedValueForComplexObject = deserializeFromParsedObjWithClassMapping(complexParsedObj, classMapping);
  const deserializedValueForFunctionStyleConstructorInstance = deserializeFromParsedObjWithClassMapping({
    age: 42,
    ess_cn: 'Person'
  }, classPersonMapping);

  test('will return Boolean wrapper object as expected', () => {
    expect(deserializedValueForBooleanObject).toStrictEqual(new Boolean(false));
  });

  test('will return Error object as expected', () => {
    expect(deserializedValueForErrorObject.name).toBe('UnexpectedError');
  });

  test('will return Infinity as expected', () => {
    expect(deserializedValueForNotFinite).toBe(Infinity);
  });

  test('will return undefined as expected', () => {
    expect(deserializedValueForUndefined).toBe(undefined);
  });

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

  test('can deserialize function style class constructor', () => {
    expect(deserializedValueForFunctionStyleConstructorInstance.isOld()).toBe(false);
  });
});

describe('Test deserializeFromParsedObj', () => {
  test('will deserialize complex object successfully', () => {
    const deserializedValueForComplexObject = deserializeFromParsedObj(complexParsedObj, [SuperClassA, ClassA, ClassB, ClassC], {});
    expect(deserializedValueForComplexObject.toy.height).toBe(29);
  });

  test('will deserialize object with Date field value', () => {
    const deserializedValueForObjWithDateFieldValue = deserializeFromParsedObj(parsedObjWithDateFieldValue, [], {});
    expect(deserializedValueForObjWithDateFieldValue.date).toStrictEqual(new Date('2021-02-19T08:24:00Z'));
  });

  test('will deserialize object with invalid Date field as null', () => {
    const deserializedValueForObjWithDateFieldValue = deserializeFromParsedObj(parsedObjWithInvalidDateFieldValue, [], {});
    expect(deserializedValueForObjWithDateFieldValue.date).toBe(null);
  });

  test('support instanceof operator', () => {
    const deserializedValueForComplexObject = deserializeFromParsedObj(complexParsedObj, [SuperClassA, ClassA, ClassB, ClassC], {});
    expect(deserializedValueForComplexObject instanceof ClassB).toBe(true);
  });
});
