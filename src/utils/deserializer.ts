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
  BUILTIN_CLASS_DATE,
  BUILTIN_TYPE_NOT_FINITE,
  BUILTIN_TYPE_UNDEFINED,
  CLASS_NAME_FIELD,
  TIMESTAMP_FIELD,
  TO_STRING_FIELD
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
    return parsedObj.map((item) => {
      return deserializeFromParsedObjWithClassMapping(item, classMapping)
    });
  }

  const classNameInParsedObj:string = parsedObj[CLASS_NAME_FIELD];
  switch (classNameInParsedObj) {
    case BUILTIN_TYPE_UNDEFINED:
      return undefined;
    case BUILTIN_TYPE_NOT_FINITE:
      return getValueFromToStringResult(parsedObj[TO_STRING_FIELD]);
    case BUILTIN_CLASS_DATE:
      return deserializeDate(parsedObj);
  }

  if (classNameInParsedObj && !classMapping[classNameInParsedObj]) {
    throw new Error(`Class ${classNameInParsedObj} not found`);
  }

  const deserializedObj:object = deserializeClassProperty(classMapping[classNameInParsedObj]);
  return deserializeValuesWithClassMapping(deserializedObj, parsedObj, classMapping);
}

function deserializeDate(parsedObj) {
  return typeof parsedObj[TIMESTAMP_FIELD] === 'number' ? new Date(parsedObj[TIMESTAMP_FIELD]) : null;
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
