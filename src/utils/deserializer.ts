/**
 * Created by cshao on 2021-02-19.
 */


'use strict';

import {isClass, notObject} from './general';
import {BUILTIN_CLASS_DATE, CLASS_NAME_FIELD, TIMESTAMP_FIELD} from './constant';

const REGEXP_BEGIN_WITH_CLASS = /^\s*class\s+/;

function deserializeFromParsedObj(parsedObj:any, classes?:Array<any>): any {
  return deserializeFromParsedObjWithClassMapping(parsedObj, getClassMappingFromClassArray(classes));
}

function deserializeFromParsedObjWithClassMapping(parsedObj:any, classMapping:object): any {
  if (notObject(parsedObj)) {
    return parsedObj;
  }

  const classNameInParsedObj:string = parsedObj[CLASS_NAME_FIELD];
  if (classNameInParsedObj === BUILTIN_CLASS_DATE) {
    return typeof parsedObj[TIMESTAMP_FIELD] === 'number' ? new Date(parsedObj[TIMESTAMP_FIELD]) : null;
  }
  if (classNameInParsedObj && !classMapping[classNameInParsedObj]) {
    throw new Error(`Class ${classNameInParsedObj} not found`);
  }

  return deserializeValuesWithClassMapping(deserializeClassProperty(classMapping[classNameInParsedObj]), parsedObj, classMapping);
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
    deserializedObj[k] = deserializeValueWithClassMapping(parsedObj[k], classMapping);
  }
  return deserializedObj;
}

function deserializeValueWithClassMapping(value, classMapping) {
  if (Array.isArray(value)) {
    // @ts-ignore
    return value.map((item) => {
      return deserializeFromParsedObjWithClassMapping(item, classMapping)
    });
  } else {
    // @ts-ignore
    return deserializeFromParsedObjWithClassMapping(value, classMapping);
  }
}

/**
 *
 * @param classes It's an array of Class definition. "any" is used in code only
 * because there is no TypeScript type definition for Class.
 */
function getClassMappingFromClassArray(classes:Array<any> = []): object {
  const classMapping:object = {};
  [Date].concat(classes).forEach((c) => {
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