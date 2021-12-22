/**
 * Created by cshao on 2021/12/22
 */

'use strict';

import ClassA from "./env/ClassA";

const ESSerializer = require("../src/index");

describe('Test interceptRequire', () => {
  test('can enable/disable require interception', () => {
    ESSerializer.interceptRequire();
    expect(ESSerializer.isInterceptingRequire()).toBe(true);
    ESSerializer.stopInterceptRequire();
    expect(ESSerializer.isInterceptingRequire()).toBe(false);
  });

  test('can getRequiredClasses and clearRequiredClasses', () => {
    const requiredClasses = ESSerializer.getRequiredClasses();
    requiredClasses.ClassA = ClassA;
    expect(ESSerializer.getRequiredClasses()).toStrictEqual({
      'ClassA': ClassA
    });
    ESSerializer.clearRequiredClasses();
    expect(ESSerializer.getRequiredClasses()).toStrictEqual({});
  });
});
