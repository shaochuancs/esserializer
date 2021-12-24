/**
 * Created by cshao on 2021/12/22
 */

'use strict';

import User from "./env/User";

const ESSerializer = require('../src/index');

describe('Test special object properties', () => {
  test('can serialize and deserialize getter/setter defined in class constructor', () => {
    const user = new User('P123456', 'Mike');
    // @ts-ignore
    user.location = 'Zhejiang_Ningbo';
    const serializedString = ESSerializer.serialize(user);
    const deserializedObj = ESSerializer.deserialize(serializedString, [User]);
    expect(deserializedObj.location).toBe('Zhejiang : Ningbo');
    expect(typeof Object.getOwnPropertyDescriptor(deserializedObj, 'location').get).toBe('function');
    expect(typeof Object.getOwnPropertyDescriptor(deserializedObj, 'location').set).toBe('function');
  });

  test('can serialize and deserialize read only property defined in class constructor', () => {
    const user = new User('P123456', 'Mike');
    const serializedString = ESSerializer.serialize(user);
    const deserializedObj = ESSerializer.deserialize(serializedString, [User], {
      fieldsForConstructorParameters: ['idNum', 'name']
    });
    expect(deserializedObj.displayName).toBe('P123456_Mike');
    expect(deserializedObj.displayObject).toStrictEqual({
      identity: 'P123456',
      nickname: 'Mike'
    });
  });

  test('can deal with invalid field that is passed to class constructor', () => {
    const user = new User('P123456', 'Mike');
    const serializedString = ESSerializer.serialize(user);
    const deserializedObj = ESSerializer.deserialize(serializedString, [User], {
      fieldsForConstructorParameters: ['notExistedField', 'name']
    });
    expect(deserializedObj.displayName).toBe('[object Object]_Mike');
  });

  test('can deal with redundant field that is passed to class constructor', () => {
    const user = new User('P123456', 'Mike');
    const serializedString = ESSerializer.serialize(user);
    const deserializedObj = ESSerializer.deserialize(serializedString, [User], {
      fieldsForConstructorParameters: ['idNum', 'name', 'redundantField']
    });
    expect(deserializedObj.displayName).toBe('P123456_Mike');
  });

  test('can deal with missing field that is passed to class constructor', () => {
    const user = new User('P123456', 'Mike');
    const serializedString = ESSerializer.serialize(user);
    const deserializedObj = ESSerializer.deserialize(serializedString, [User], {
      fieldsForConstructorParameters: ['idNum']
    });
    expect(deserializedObj.displayName).toBe('P123456_[object Object]');
  });

  test('can retain raw property text value during deserialization', () => {
    const text = '{"user":"Alice","data":{"row":1234,"column":21,"url":"https://example.com"}}';
    const deserializedObj = ESSerializer.deserialize(text, [], {
      rawProperties: ['data']
    });
    expect(deserializedObj.data).toBe('{"row":1234,"column":21,"url":"https://example.com"}');
  });

  test('can ignore properties during deserialization', () => {
    const text = '{"user":"Alice","data":{"row":1234,"column":21,"url":"https://example.com"}}';
    const deserializedObj = ESSerializer.deserialize(text, [], {
      ignoreProperties: ['data']
    });
    expect(deserializedObj.data).toBeUndefined();
  });
});
