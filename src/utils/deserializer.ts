/**
 * Created by cshao on 2021-02-19.
 */


'use strict';

import {isClass} from './general';

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

export {
  getClassMappingFromClassArray
};