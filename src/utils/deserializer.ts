/**
 * Created by cshao on 2021-02-19.
 */


'use strict';

import {
  getValueFromToStringResult,
  isClass,
  notObject
} from './general';
import {
  ESSERIALIZER_NULL,
  BOOLEAN_FIELD,
  BUILTIN_CLASS_INT8ARRAY,
  BUILTIN_CLASS_UINT8ARRAY,
  BUILTIN_CLASS_UINT8CLAMPEDARRAY,
  BUILTIN_CLASS_INT16ARRAY,
  BUILTIN_CLASS_UINT16ARRAY,
  BUILTIN_CLASS_INT32ARRAY,
  BUILTIN_CLASS_UINT32ARRAY,
  BUILTIN_CLASS_FLOAT32ARRAY,
  BUILTIN_CLASS_FLOAT64ARRAY,
  BUILTIN_CLASS_BIGINT64ARRAY,
  BUILTIN_CLASS_BIGUINT64ARRAY,
  BUILTIN_CLASS_ARRAYBUFFER,
  BUILTIN_CLASS_SHAREDARRAYBUFFER,
  BUILTIN_CLASS_BOOLEAN,
  BUILTIN_CLASS_DATE,
  BUILTIN_CLASS_REGEXP,
  BUILTIN_CLASS_SET,
  BUILTIN_CLASS_STRING,
  BUILTIN_CLASS_ERROR,
  BUILTIN_CLASS_EVAL_ERROR,
  BUILTIN_CLASS_RANGE_ERROR,
  BUILTIN_CLASS_REFERENCE_ERROR,
  BUILTIN_CLASS_SYNTAX_ERROR,
  BUILTIN_CLASS_TYPE_ERROR,
  BUILTIN_CLASS_URI_ERROR,
  BUILTIN_CLASS_AGGREGATE_ERROR,
  BUILTIN_TYPE_NOT_FINITE,
  BUILTIN_TYPE_UNDEFINED,
  CLASS_NAME_FIELD,
  TIMESTAMP_FIELD,
  TO_STRING_FIELD, BUILTIN_TYPE_BIG_INT, ARRAY_FIELD
} from './constant';
const REGEXP_BEGIN_WITH_CLASS = /^\s*class\s+/;

function deserializeFromParsedObj(parsedObj:any, classes?:Array<any>): any {
  return deserializeFromParsedObjWithClassMapping(parsedObj, getClassMappingFromClassArray(classes));
}

function deserializeFromParsedObjWithClassMapping(parsedObj:any, classMapping:object): any {
  if (notObject(parsedObj)) {
    return parsedObj;
  }

  if (Array.isArray(parsedObj)) {
    return _deserializeArray(parsedObj, classMapping);
  }

  const classNameInParsedObj:string = parsedObj[CLASS_NAME_FIELD];
  const deserializedValueForBuiltinType = _deserializeBuiltinTypes(classNameInParsedObj, parsedObj, classMapping);
  if (deserializedValueForBuiltinType !== ESSERIALIZER_NULL) {
    return deserializedValueForBuiltinType;
  }

  if (classNameInParsedObj && !classMapping[classNameInParsedObj]) {
    throw new Error(`Class ${classNameInParsedObj} not found`);
  }

  const deserializedObj:object = deserializeClassProperty(classMapping[classNameInParsedObj]);
  return deserializeValuesWithClassMapping(deserializedObj, parsedObj, classMapping);
}

function _deserializeArray(parsedObj, classMapping:object) {
  return parsedObj.map((item) => {
    return deserializeFromParsedObjWithClassMapping(item, classMapping)
  });
}

function _deserializeBuiltinTypes(classNameInParsedObj, parsedObj, classMapping) {
  switch (classNameInParsedObj) {
    case BUILTIN_CLASS_INT8ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Int8Array);
    case BUILTIN_CLASS_UINT8ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Uint8Array);
    case BUILTIN_CLASS_UINT8CLAMPEDARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Uint8ClampedArray);
    case BUILTIN_CLASS_INT16ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Int16Array);
    case BUILTIN_CLASS_UINT16ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Uint16Array);
    case BUILTIN_CLASS_INT32ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Int32Array);
    case BUILTIN_CLASS_UINT32ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Uint32Array);
    case BUILTIN_CLASS_FLOAT32ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Float32Array);
    case BUILTIN_CLASS_FLOAT64ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Float64Array);
    case BUILTIN_CLASS_BIGINT64ARRAY:
      return _deserializeBigIntArrayInstance(parsedObj[ARRAY_FIELD], BigInt64Array);
    case BUILTIN_CLASS_BIGUINT64ARRAY:
      return _deserializeBigIntArrayInstance(parsedObj[ARRAY_FIELD], BigUint64Array);
    case BUILTIN_TYPE_BIG_INT:
      return deserializeBigInt(parsedObj[TO_STRING_FIELD]);
    case BUILTIN_TYPE_UNDEFINED:
      return undefined;
    case BUILTIN_TYPE_NOT_FINITE:
      return getValueFromToStringResult(parsedObj[TO_STRING_FIELD]);
    case BUILTIN_CLASS_ARRAYBUFFER:
      return _deserializeArrayBuffer(parsedObj[ARRAY_FIELD]);
    case BUILTIN_CLASS_SHAREDARRAYBUFFER:
      return _deserializeSharedArrayBuffer(parsedObj[ARRAY_FIELD]);
    case BUILTIN_CLASS_BOOLEAN:
      return deserializeBoolean(parsedObj);
    case BUILTIN_CLASS_DATE:
      return deserializeDate(parsedObj);
    case BUILTIN_CLASS_REGEXP:
      return deserializeRegExp(parsedObj);
    case BUILTIN_CLASS_SET:
      return _deserializeSet(parsedObj, classMapping);
    case BUILTIN_CLASS_STRING:
      return deserializeString(parsedObj);
    case BUILTIN_CLASS_ERROR:
      return deserializeError(parsedObj, Error);
    case BUILTIN_CLASS_EVAL_ERROR:
      return deserializeError(parsedObj, EvalError);
    case BUILTIN_CLASS_RANGE_ERROR:
      return deserializeError(parsedObj, RangeError);
    case BUILTIN_CLASS_REFERENCE_ERROR:
      return deserializeError(parsedObj, ReferenceError);
    case BUILTIN_CLASS_SYNTAX_ERROR:
      return deserializeError(parsedObj, SyntaxError);
    case BUILTIN_CLASS_TYPE_ERROR:
      return deserializeError(parsedObj, TypeError);
    case BUILTIN_CLASS_URI_ERROR:
      return deserializeError(parsedObj, URIError);
    case BUILTIN_CLASS_AGGREGATE_ERROR:
      return deserializeError(parsedObj, AggregateError);
    default:
      return ESSERIALIZER_NULL;
  }
}

function _deserializeArrayBuffer(byteArray) {
  return new Uint8Array(byteArray).buffer;
}

function _deserializeSharedArrayBuffer(byteArray) {
  const sab = new SharedArrayBuffer(byteArray.length);
  const sabViewArray = new Uint8Array(sab);
  byteArray.forEach((byte, index) => {
    sabViewArray[index] = byte;
  });
  return sab;
}

function _deserializeArrayInstance(arr, ArrayClass) {
  return new ArrayClass(arr);
}

function _deserializeBigIntArrayInstance(arr, ArrayClass) {
  return new ArrayClass(arr.map((biObj) => {
    return deserializeBigInt(biObj[TO_STRING_FIELD]);
  }));
}

function deserializeBigInt(str) {
  return BigInt(str);
}

function deserializeBoolean(parsedObj) {
  return new Boolean(parsedObj[BOOLEAN_FIELD]);
}

function deserializeDate(parsedObj) {
  return typeof parsedObj[TIMESTAMP_FIELD] === 'number' ? new Date(parsedObj[TIMESTAMP_FIELD]) : null;
}

function deserializeRegExp(parsedObj) {
  const regExpStr = parsedObj[TO_STRING_FIELD];
  const lastIndexOfSlash = regExpStr.lastIndexOf('/');
  return new RegExp(regExpStr.substring(1, lastIndexOfSlash), regExpStr.substring(lastIndexOfSlash+1));
}

function _deserializeSet(parsedObj, classMapping) {
  return new Set(_deserializeArray(parsedObj[ARRAY_FIELD], classMapping));
}

function deserializeString(parsedObj) {
  return new String(parsedObj[TO_STRING_FIELD]);
}

function deserializeError(parsedObj, ErrorClass) {
  let error;
  if (parsedObj.message) {
    // @ts-ignore
    error = new ErrorClass(parsedObj.message);
  } else {
    // @ts-ignore
    error = new ErrorClass();
  }
  delete error.stack;

  if (parsedObj.name) {
    error.name = parsedObj.name;
  }
  if (parsedObj.stack) {
    error.stack = parsedObj.stack;
  }

  if (ErrorClass === AggregateError) {
    error.errors = deserializeFromParsedObjWithClassMapping(parsedObj.errors, {});
  }

  return error;
}

function deserializeClassProperty(classObj) {
  let deserializedObj:object = {};

  if (!classObj) {
    return deserializedObj;
  }

  if (REGEXP_BEGIN_WITH_CLASS.test(classObj.toString())) {
    Object.setPrototypeOf(deserializedObj, classObj ? classObj.prototype : Object.prototype);
  } else {// It's class in function style.
    deserializedObj = Object.create(classObj.prototype.constructor.prototype);
    classObj.prototype.constructor.call(deserializedObj)
  }
  return deserializedObj;
}

function deserializeValuesWithClassMapping(deserializedObj, parsedObj, classMapping) {
  for (const k in parsedObj) {
    if (k === CLASS_NAME_FIELD) {
      continue;
    }
    deserializedObj[k] = deserializeFromParsedObjWithClassMapping(parsedObj[k], classMapping);
  }
  return deserializedObj;
}

/**
 *
 * @param classes It's an array of Class definition. "any" is used in code only
 * because there is no TypeScript type definition for Class.
 */
function getClassMappingFromClassArray(classes:Array<any> = []): object {
  const classMapping:object = {};
  classes.forEach((c) => {
    if (!isClass(c)) {
      return;
    }
    // @ts-ignore
    classMapping[c.name] = c;
  });

  return classMapping;
}

/**
 *
 * @param classObj It's a Class definition. "any" is used in code only
 * because there is no TypeScript type definition for Class.
 */
function getParentClassName(classObj:any): string {
  return classObj.prototype.__proto__.constructor.name;
}

export {
  deserializeFromParsedObj,
  deserializeFromParsedObjWithClassMapping,
  getClassMappingFromClassArray,
  getParentClassName
};
