/**
 * Created by cshao on 2021-02-19.
 */


'use strict';

import {isClass, notObject} from './general';
import {CLASS_NAME_FIELD} from './constant';

function deserializeFromParsedObj(parsedObj:any, classes?:Array<any>): any {
  return deserializeFromParsedObjWithClassMapping(parsedObj, getClassMappingFromClassArray(classes));
}

function deserializeFromParsedObjWithClassMapping(parsedObj:any, classMapping:object): any {
  if (notObject(parsedObj)) {
    return parsedObj;
  }

  const deserializedObj:object = {};
  const classNameInParsedObj:string = parsedObj[CLASS_NAME_FIELD];
  if (classNameInParsedObj) {
    // @ts-ignore
    deserializedObj.__proto__ = getProtoFromClassObj(classMapping[classNameInParsedObj], classMapping);
  }

  for (const k in parsedObj) {
    if (k === CLASS_NAME_FIELD) {
      continue;
    }
    const v = parsedObj[k];

    if (Array.isArray(v)) {
      // @ts-ignore
      deserializedObj[k] = v.map((item) => {
        return deserializeFromParsedObjWithClassMapping(item, classMapping)
      });
    } else {
      // @ts-ignore
      deserializedObj[k] = deserializeFromParsedObjWithClassMapping(v, classMapping);
    }
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

function getProtoFromClassObj(classObj:any, classMapping:object): object {
  const __proto__Obj:object = {
    constructor: classObj
  };
  const parentClassName:string = getParentClassName(classObj);
  if (parentClassName !== 'Object') {
    // @ts-ignore
    __proto__Obj.__proto__ = getProtoFromClassObj(classMapping[parentClassName], classMapping);
  }

  const prototypePropertyNames = Object.getOwnPropertyNames(classObj.prototype);
  for (const i in prototypePropertyNames) {
    const propertyName = prototypePropertyNames[i];
    if (propertyName === 'constructor') {
      continue;
    }

    const propertyDescriptor = Object.getOwnPropertyDescriptor(classObj.prototype, propertyName);

    // It's a plain property field
    if (propertyDescriptor.value) {
      // @ts-ignore
      __proto__Obj[propertyName] = classObj.prototype[propertyName];
      continue;
    }

    // It's a getter or setter
    if (propertyDescriptor.get || propertyDescriptor.set) {
      Object.defineProperty(__proto__Obj, propertyName, {
        get: propertyDescriptor.get,
        set: propertyDescriptor.set
      });
    }
  }
  return __proto__Obj;
}

export {
  deserializeFromParsedObj,
  deserializeFromParsedObjWithClassMapping,
  getClassMappingFromClassArray,
  getParentClassName,
  getProtoFromClassObj
};