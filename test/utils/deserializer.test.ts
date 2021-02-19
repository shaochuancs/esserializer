/**
 * Created by cshao on 2021-02-19.
 */


'use strict';

import {getClassMappingFromClassArray} from '../../src/utils/deserializer';

import ClassA from '../env/ClassA';
import ClassB from '../env/ClassB';

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
});