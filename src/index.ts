/**
 * Created by cshao on 2021-02-09.
 */


'use strict';

import {CLASS_NAME_FIELD} from './utils/constant';
import {notObject} from './utils/general';
import {getSerializeValueWithClassName} from './utils/serializer';
import {getClassMappingFromClassArray} from './utils/deserializer';

class ESSerializer {
  private static deserializeFromParsedObj(parsedObj:any, classMapping:object): any {
    if (notObject(parsedObj)) {
      return parsedObj;
    }

    const deserializedObj:object = {};
    const classNameInParsedObj:string = parsedObj[CLASS_NAME_FIELD];
    if (classNameInParsedObj) {
      // @ts-ignore
      deserializedObj.__proto__ = ESSerializer.getProtoFromClassObj(classMapping[classNameInParsedObj], classMapping);
    }

    for (const k in parsedObj) {
      if (k === CLASS_NAME_FIELD) {
        continue;
      }
      const v = parsedObj[k];

      if (Array.isArray(v)) {
        // @ts-ignore
        deserializedObj[k] = v.map((item) => {
          return ESSerializer.deserializeFromParsedObj(item, classMapping)
        });
      } else {
        // @ts-ignore
        deserializedObj[k] = ESSerializer.deserializeFromParsedObj(v, classMapping);
      }
    }
    return deserializedObj;
  }

  private static getProtoFromClassObj(classObj:any, classMapping:object): object {
    const __proto__Obj:object = {
      constructor: classObj
    };
    const parentClassName:string = ESSerializer.getParentClassName(classObj);
    if (parentClassName !== 'Object') {
      // @ts-ignore
      __proto__Obj.__proto__ = ESSerializer.getProtoFromClassObj(classMapping[parentClassName], classMapping);
    }

    const prototypePropertyNames = Object.getOwnPropertyNames(classObj.prototype);
    for (const i in prototypePropertyNames) {
      const propertyName = prototypePropertyNames[i];
      if (propertyName === 'constructor') {
        continue;
      }

      const propertyDescriptor = Object.getOwnPropertyDescriptor(classObj.prototype, propertyName);

      if (propertyDescriptor.value) {
        // @ts-ignore
        __proto__Obj[propertyName] = classObj.prototype[propertyName];
        continue;
      }

      if (propertyDescriptor.get || propertyDescriptor.set) {
        Object.defineProperty(__proto__Obj, propertyName, {
          get: propertyDescriptor.get,
          set: propertyDescriptor.set
        });
      }
    }
    return __proto__Obj;
  }

  private static getParentClassName(classObj:any): string {
    return classObj.prototype.__proto__.constructor.name;
  }

  /**
   * @param target
   */
  public static serialize(target:any): string {
    return JSON.stringify(getSerializeValueWithClassName(target));
  }

  /**
   * @param serializedText
   * @param classes [ExampleClassA, ExampleClassB, ...] It's an array of Class definition. "any" is used in code only
   * because there is no TypeScript type definition for Class.
   */
  public static deserialize(serializedText:string, classes?:Array<any>): any {
    return ESSerializer.deserializeFromParsedObj(JSON.parse(serializedText), getClassMappingFromClassArray(classes));
  }
}

module.exports = ESSerializer;