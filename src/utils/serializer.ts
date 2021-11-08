/**
 * Created by cshao on 2021-02-18.
 */


'use strict';

import SerializeOptions from "../model/SerializeOptions";
import {
  ALL_BUILTIN_ARRAYS,
  ALL_BUILTIN_ERRORS,
  ALL_BUILTIN_INTLS,
  CLASSNAMES_WHOSE_ENUMERABLE_PROPERTIES_SHOULD_BE_IGNORED,
  BUILTIN_CLASS_AGGREGATE_ERROR,
  BUILTIN_CLASS_ARRAYBUFFER,
  BUILTIN_CLASS_SHAREDARRAYBUFFER,
  BUILTIN_CLASS_BOOLEAN,
  BUILTIN_CLASS_DATAVIEW,
  BUILTIN_CLASS_DATE,
  BUILTIN_CLASS_REGEXP,
  BUILTIN_CLASS_SET,
  BUILTIN_CLASS_STRING,
  BUILTIN_TYPE_NOT_FINITE,
  BUILTIN_TYPE_UNDEFINED,
  BOOLEAN_FIELD,
  CLASS_NAME_FIELD,
  OPTIONS_FIELD,
  TIMESTAMP_FIELD,
  TO_STRING_FIELD, BUILTIN_TYPE_BIG_INT, ESSERIALIZER_NULL, ARRAY_FIELD, BUILTIN_CLASS_INTL_LOCALE
} from './constant';
import {notObject} from './general';

function getSerializeValueWithClassName(target:any, options:SerializeOptions = {}): any {
  const serializeValueForBuiltinTypes = _getSerializeValueForBuiltinTypes(target);
  if (serializeValueForBuiltinTypes !== ESSERIALIZER_NULL) {
    return serializeValueForBuiltinTypes;
  }

  if (Array.isArray(target)) {
    return _serializeArray(target);
  }

  const serializedObj = {};
  if (!_shouldIgnoreEnumerableProperties(target)) {
    if (options.ignoreProperties) {
      options.ignoreProperties.forEach((ignored) => {
        delete target[ignored];
      });
    }

    if (options.interceptProperties) {
      for (const intercepted in options.interceptProperties) {
        target[intercepted] = options.interceptProperties[intercepted].call(target, target[intercepted]);
      }
    }

    for (const k in target) {
      // @ts-ignore
      serializedObj[k] = getSerializeValueWithClassName(target[k]);
    }
  }

  return appendClassInfoAndAssignDataForBuiltinType(target, serializedObj);
}

function appendClassInfoAndAssignDataForBuiltinType(target: any, serializedObj) {
  const className:string = target.__proto__.constructor.name;
  if (className !== 'Object') {
    // @ts-ignore
    serializedObj[CLASS_NAME_FIELD] = className;

    if (className === BUILTIN_CLASS_ARRAYBUFFER || className === BUILTIN_CLASS_SHAREDARRAYBUFFER) {
      serializedObj[ARRAY_FIELD] = _serializeArray(Array.from(new Uint8Array(target)));
    } else if (className === BUILTIN_CLASS_BOOLEAN) {
      serializedObj[BOOLEAN_FIELD] = (target as Boolean).valueOf();
    } else if (className === BUILTIN_CLASS_DATAVIEW) {
      serializedObj[ARRAY_FIELD] = _serializeArray(Array.from(new Uint8Array(target.buffer)));
    } else if (className === BUILTIN_CLASS_DATE) {
      serializedObj[TIMESTAMP_FIELD] = (target as Date).getTime();
    } else if (className === BUILTIN_CLASS_INTL_LOCALE) {
      serializedObj[TO_STRING_FIELD] = target.toString();
    } else if (className === BUILTIN_CLASS_REGEXP) {
      serializedObj[TO_STRING_FIELD] = target.toString();
    } else if (className === BUILTIN_CLASS_SET) {
      serializedObj[ARRAY_FIELD] = _serializeArray(Array.from(target));
    } else if (className === BUILTIN_CLASS_STRING) {
      serializedObj[TO_STRING_FIELD] = target.toString();
    } else if (ALL_BUILTIN_ARRAYS.includes(className)) {
      serializedObj[ARRAY_FIELD] = _serializeArray(Array.from(target));
    } else if (ALL_BUILTIN_ERRORS.includes(className)) {
      _assignDataForErrorType(target, serializedObj, className);
    } else if (ALL_BUILTIN_INTLS.includes(className)) {
      serializedObj[OPTIONS_FIELD] = target.resolvedOptions();
    }
  }
  return serializedObj;
}

function _assignDataForErrorType(target, serializedObj, className) {
  if (target.name !== 'Error') {
    serializedObj.name = target.name;
  }
  if (target.message) {
    serializedObj.message = target.message;
  }
  if (target.stack) {
    serializedObj.stack = target.stack;
  }

  if (className === BUILTIN_CLASS_AGGREGATE_ERROR) {
    serializedObj.errors = getSerializeValueWithClassName(target.errors);
  }
}

function _getSerializeValueForBuiltinTypes(target) {
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

  if (typeof target === 'bigint') {
    return {
      [CLASS_NAME_FIELD]: BUILTIN_TYPE_BIG_INT,
      [TO_STRING_FIELD]: target.toString()
    };
  }

  if (notObject(target)) {
    return target;
  }

  return ESSERIALIZER_NULL;
}

function _serializeArray(arr) {
  return arr.map((elem) => {
    return getSerializeValueWithClassName(elem);
  });
}

function _shouldIgnoreEnumerableProperties(target) {
  const className:string = target.__proto__.constructor.name;
  return CLASSNAMES_WHOSE_ENUMERABLE_PROPERTIES_SHOULD_BE_IGNORED.includes(className);
}

export {
  getSerializeValueWithClassName
};
