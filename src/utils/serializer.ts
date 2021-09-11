/**
 * Created by cshao on 2021-02-18.
 */


'use strict';

import {
  BUILTIN_CLASS_BOOLEAN,
  BUILTIN_CLASS_DATE,
  BUILTIN_CLASS_ERROR,
  BUILTIN_TYPE_NOT_FINITE,
  BUILTIN_TYPE_UNDEFINED,
  BOOLEAN_FIELD,
  CLASS_NAME_FIELD,
  TIMESTAMP_FIELD,
  TO_STRING_FIELD
} from './constant';
import {notObject} from './general';

function getSerializeValueWithClassName(target:any): any {
  if (target === undefined) {
    return {
      [CLASS_NAME_FIELD]: BUILTIN_TYPE_UNDEFINED
    };
  }

  // Infinity, -Infinity, NaN
  if (typeof target === 'number' && !isFinite(target)) {
    return {
      [CLASS_NAME_FIELD]: BUILTIN_TYPE_NOT_FINITE,
      [TO_STRING_FIELD]: target.toString()
    };
  }

  if (notObject(target)) {
    return target;
  }

  if (Array.isArray(target)) {
    return target.map((t:any) => {
      return getSerializeValueWithClassName(t);
    });
  }

  const serializedObj = {};
  for (const k in target) {
    // @ts-ignore
    serializedObj[k] = getSerializeValueWithClassName(target[k]);
  }

  return appendClassInfo(target, serializedObj);
}

function appendClassInfo(target: any, serializedObj) {
  const className:string = target.__proto__.constructor.name;
  if (className !== 'Object') {
    // @ts-ignore
    serializedObj[CLASS_NAME_FIELD] = className;

    if (className === BUILTIN_CLASS_BOOLEAN) {
      serializedObj[BOOLEAN_FIELD] = (target as Boolean).valueOf();
    } else if (className === BUILTIN_CLASS_DATE) {
      serializedObj[TIMESTAMP_FIELD] = (target as Date).getTime();
    } else if (className === BUILTIN_CLASS_ERROR) {
      const error = target as Error;
      if (error.name !== 'Error') {
        serializedObj.name = error.name;
      }
      if (error.message) {
        serializedObj.message = error.message;
      }
      if (error.stack) {
        serializedObj.stack = error.stack;
      }
    }
  }
  return serializedObj;
}

export {
  getSerializeValueWithClassName
};
