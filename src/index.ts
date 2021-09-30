/**
 * Created by cshao on 2021-02-09.
 */


'use strict';

import {getSerializeValueWithClassName} from './utils/serializer';
import {deserializeFromParsedObj} from './utils/deserializer';

let Module;
if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
  Module = require('module');
}

class ESSerializer {

  private static isRequireIntercepted = false;
  private static requiredClasses:object = {};

  public static interceptRequire() {
    if (this.isRequireIntercepted) {
      return;
    }
    this.isRequireIntercepted = true;

    if (!Module) {
      throw new Error('Cannot intercept require in non-Node environment.');
    }

    const originRequire = Module.prototype.require;
    Module.prototype.require = function () {
      const requiredClass = originRequire.apply(this, arguments);
      const requiredClassName = requiredClass.name;
      if (!ESSerializer.requiredClasses[requiredClassName]) {
        ESSerializer.requiredClasses[requiredClassName] = requiredClass;
      }

      return requiredClass;
    };
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
  public static deserialize(serializedText:string, classes:Array<any> = []): any {
    return deserializeFromParsedObj(JSON.parse(serializedText), Object.values(this.requiredClasses).concat(classes));
  }
}

module.exports = ESSerializer;
