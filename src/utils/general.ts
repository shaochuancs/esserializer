/**
 * Created by cshao on 2021-02-19.
 */

'use strict';

function notObject(target:any): boolean {
  return target === null || typeof target !== 'object';
}

function isSupportedBuiltinClass(target: any): boolean {
  return [Date].indexOf(target) >= 0;
}

function isClass(target:any): boolean {
  if (isSupportedBuiltinClass(target)) {
    return true;
  }
  return !!target.name && typeof target === 'function' && /^\s*class\s+/.test(target.toString());
}

export {
  notObject,
  isClass
};