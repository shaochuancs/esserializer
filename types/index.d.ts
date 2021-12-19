/**
 * Created by cshao on 2021/12/18
 */

import SerializeOptions from "./model/SerializeOptions";

/**
 * Enable require interception to detect classes automatically.
 */
declare function interceptRequire();

/**
 * Disable require interception.
 */
declare function stopInterceptRequire();

/**
 * Return the status of require interception.
 */
declare function isInterceptingRequire():boolean;

/**
 * Get the intercepted required classes
 */
declare function getRequiredClasses():object;

/**
 * Clear all required classes.
 */
declare function clearRequiredClasses();

/**
 *
 * @param classDef A class definition.
 */
declare function registerClass(classDef:any);

/**
 *
 * @param classes An array of Class definition.
 */
declare function registerClasses(classes:Array<any>);

/**
 * Clear all registered classes.
 */
declare function clearRegisteredClasses();

/**
 *
 * @param target Object or primitive to serialize.
 * @param options Options during serialization, such as ignoreProperties and interceptProperties.
 */
declare function serialize(target: any, options?:SerializeOptions): string;

/**
 *
 * @param serializedText Text previously serialized.
 * @param classes [ExampleClassA, ExampleClassB, ...] An array of Class definition.
 */
declare function deserialize(serializedText:string, classes?:Array<any>): any;

export {
  interceptRequire,
  stopInterceptRequire,
  isInterceptingRequire,
  getRequiredClasses,
  clearRequiredClasses,
  registerClass,
  registerClasses,
  clearRegisteredClasses,
  serialize,
  deserialize
};
