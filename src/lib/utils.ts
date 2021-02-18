/**
 * Created by cshao on 2021-02-18.
 */

'use strict';

function notObject(target:any): boolean {
  return target === null || typeof target !== 'object';
}

module.exports = {
  notObject
};
