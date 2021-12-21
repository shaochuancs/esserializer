/**
 * Created by cshao on 2021-02-09.
 */


'use strict';

import DeserializeOptions from "./model/DeserializationOptions";
import SerializeOptions from "./model/SerializeOptions";

import {getSerializeValueWithClassName} from './utils/serializer';
import {deserializeFromParsedObj} from './utils/deserializer';

let Module;
if ((typeof process !== 'undefined') && (process.release.name === 'node')) {
  Module = eval('require')('module'); // Prevent webpack from packaging module here, using eval.
}

class ESSerializer {

  private static originRequire = null;
  private static isRequireIntercepted = false;
  private static requiredClasses:object = {};

  private static registeredClasses:Array<any> = [];

  private static throwErrorIfInNonNodeEnvironment() {
    if (!Module) {
      throw new Error('Cannot intercept require in non-Node environment.');
    }
  }

  public static interceptRequire() {
    if (this.isRequireIntercepted) {
      return;
    }
    this.isRequireIntercepted = true;

    this.throwErrorIfInNonNodeEnvironment();
    ESSerializer.originRequire = Module.prototype.require;
    Module.prototype.require = function () {
      const requiredClass = ESSerializer.originRequire.apply(this, arguments);
      const requiredClassName = requiredClass.name;
      if (!ESSerializer.requiredClasses[requiredClassName]) {
        ESSerializer.requiredClasses[requiredClassName] = requiredClass;
      }

      return requiredClass;
    };
  }

  public static stopInterceptRequire() {
    this.throwErrorIfInNonNodeEnvironment();
    Module.prototype.require = ESSerializer.originRequire;
    this.isRequireIntercepted = false;
  }

  public static isInterceptingRequire():boolean {
    return this.isRequireIntercepted;
  }

  public static getRequiredClasses():object {
    return this.requiredClasses;
  }

  public static clearRequiredClasses() {
    this.requiredClasses = {};
  }

  /**
   * Globally register class, "any" is used in code only because there is no TypeScript type definition for Class.
   * @param classDef
   */
  public static registerClass(classDef:any) {
    this.registeredClasses.push(classDef);
  }

  /**
   * Globally register classes, "any" is used in code only because there is no TypeScript type definition for Class.
   * @param classes
   */
  public static registerClasses(classes:Array<any>) {
    this.registeredClasses = this.registeredClasses.concat(classes);
  }

  public static clearRegisteredClasses() {
    this.registeredClasses = [];
  }

  /**
   * @param target
   * @param options Serialization options
   */
  public static serialize(target:any, options:SerializeOptions = {}): string {
    return JSON.stringify(getSerializeValueWithClassName(target, options));
  }

  /**
   * @param serializedText
   * @param classes [ExampleClassA, ExampleClassB, ...] It's an array of Class definition. "any" is used in code only
   * because there is no TypeScript type definition for Class.
   * @param options Deserialization options
   */
  public static deserialize(serializedText:string, classes:Array<any> = [], options:DeserializeOptions = {}): any {
    return deserializeFromParsedObj(JSON.parse(serializedText), Object.values(this.requiredClasses).concat(this.registeredClasses).concat(classes), options);
  }
}

module.exports = ESSerializer;
