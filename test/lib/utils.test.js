/**
 * Created by cshao on 2021-02-18.
 */

'use strict';

const utils = require('../../src/lib/utils');

describe('Test notObject', () => {
  test('null is not object', () => {
    expect(utils.notObject(null)).toBe(true);
  });

  test('number is not object', () => {
    expect(utils.notObject(42)).toBe(true);
  });

  test('boolean is not object', () => {
    expect(utils.notObject(false)).toBe(true);
  });

  test('undefined is not object', () => {
    expect(utils.notObject(undefined)).toBe(true);
  });

  test('string is not object', () => {
    expect(utils.notObject('TEXT')).toBe(true);
  });

  test('object is object', () => {
    expect(utils.notObject({name: 'Mike'})).toBe(false);
  });
});