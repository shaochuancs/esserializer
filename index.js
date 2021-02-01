/**
 * Created by cshao on 2019-05-22.
 */

'use strict';

function notObject(o) {
  return o === null || typeof o !== 'object';
}

function getSerialObjWithClassName(originObj) {
  if (notObject(originObj)) {
    return originObj;
  }

  if (Array.isArray(originObj)) {
    let serialArr = [];
    for (let i=0; i< originObj.length; i++) {
      serialArr.push(getSerialObjWithClassName(originObj[i]));
    }
    return serialArr;
  }

  let serialObj = {};
  for (let k in originObj) {
    let v = originObj[k];
    serialObj[k] = getSerialObjWithClassName(v);
  }
  let className = originObj.__proto__.constructor.name;
  if (className !== 'Object') {
    serialObj.className = className;
  }
  return serialObj;
}

function getParentClassName(classObj) {
  return classObj.prototype.__proto__.constructor.name;
}

function getProtoFromClassObj(classObj, classMapping) {
  let __proto__Obj = {
    constructor: classObj
  };
  let parentClassName = getParentClassName(classObj);
  if (parentClassName !== 'Object') {
    __proto__Obj.__proto__ = getProtoFromClassObj(classMapping[parentClassName], classMapping);
  }

  let prototypeProperties = Object.getOwnPropertyNames(classObj.prototype);
  for (let pi in prototypeProperties) {
    let p = prototypeProperties[pi];
    if (p === 'constructor') {
      continue;
    }
    let pd = Object.getOwnPropertyDescriptor(classObj.prototype, p);
    if (pd.value) {
      __proto__Obj[p] = classObj.prototype[p];
      continue;
    }
    if (pd.get || pd.set) {
      Object.defineProperty(__proto__Obj, p, {
        get: pd.get,
        set: pd.set
      });
    }
  }
  return __proto__Obj;
}

function deserializeFromParsedObj(parsedObj, classMapping) {
  if (notObject(parsedObj)) {
    return parsedObj;
  }

  let resultObj = {};
  if (parsedObj.className) {
    let classObj = classMapping[parsedObj.className];
    resultObj.__proto__ = getProtoFromClassObj(classObj, classMapping);
  }

  for (let k in parsedObj) {
    if (k === 'className') {
      continue;
    }
    let v = parsedObj[k];

    if (Array.isArray(v)) {
      let deSerialArr = [];
      for (let i=0; i< v.length; i++) {
        deSerialArr.push(deserializeFromParsedObj(v[i], classMapping));
      }
      resultObj[k] = deSerialArr;
    } else {
      resultObj[k] = deserializeFromParsedObj(v, classMapping);
    }
  }
  return resultObj;
}

function getClassMappingFromClassArray(classes) {
  let classArr = (classes && (Array.isArray(classes))) ? classes : [];

  let classMapping = {};
  for (let i=0; i<classArr.length; i++) {
    let classObj = classArr[i];
    classMapping[classObj.name] = classObj;
  }

  return classMapping;
}

let ESSerializer = {
  serialize: function(obj) {
    return JSON.stringify(getSerialObjWithClassName(obj));
  },
  /**
   * @param classes [ExampleClassA, ExampleClassB, ...]
   */
  deserialize: function(serializedText, classes) {
    let classMapping = getClassMappingFromClassArray(classes);
    return deserializeFromParsedObj(JSON.parse(serializedText), classMapping);
  }
};

module.exports = ESSerializer;