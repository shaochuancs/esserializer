/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function(e, a) { for(var i in a) e[i] = a[i]; if(a.__esModule) Object.defineProperty(e, "__esModule", { value: true }); }(exports,
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((module, exports, __webpack_require__) => {

eval("/**\n * Created by cshao on 2021-02-09.\n */\n\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar serializer_1 = __webpack_require__(/*! ./utils/serializer */ \"./src/utils/serializer.ts\");\nvar deserializer_1 = __webpack_require__(/*! ./utils/deserializer */ \"./src/utils/deserializer.ts\");\nvar ESSerializer = /** @class */ (function () {\n    function ESSerializer() {\n    }\n    /**\n     * @param target\n     */\n    ESSerializer.serialize = function (target) {\n        return JSON.stringify(serializer_1.getSerializeValueWithClassName(target));\n    };\n    /**\n     * @param serializedText\n     * @param classes [ExampleClassA, ExampleClassB, ...] It's an array of Class definition. \"any\" is used in code only\n     * because there is no TypeScript type definition for Class.\n     */\n    ESSerializer.deserialize = function (serializedText, classes) {\n        return deserializer_1.deserializeFromParsedObj(JSON.parse(serializedText), classes);\n    };\n    return ESSerializer;\n}());\nmodule.exports = ESSerializer;\n\n\n//# sourceURL=webpack://esserializer/./src/index.ts?");

/***/ }),

/***/ "./src/utils/constant.ts":
/*!*******************************!*\
  !*** ./src/utils/constant.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("/**\n * Created by cshao on 2021-02-19.\n */\n\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.TO_STRING_FIELD = exports.TIMESTAMP_FIELD = exports.CLASS_NAME_FIELD = exports.BOOLEAN_FIELD = exports.BUILTIN_TYPE_UNDEFINED = exports.BUILTIN_TYPE_NOT_FINITE = exports.BUILTIN_CLASS_ERROR = exports.BUILTIN_CLASS_DATE = exports.BUILTIN_CLASS_BOOLEAN = void 0;\nvar BOOLEAN_FIELD = 'ess_bool';\nexports.BOOLEAN_FIELD = BOOLEAN_FIELD;\nvar CLASS_NAME_FIELD = 'ess_cn';\nexports.CLASS_NAME_FIELD = CLASS_NAME_FIELD;\nvar TIMESTAMP_FIELD = 'ess_ts';\nexports.TIMESTAMP_FIELD = TIMESTAMP_FIELD;\nvar TO_STRING_FIELD = 'ess_str';\nexports.TO_STRING_FIELD = TO_STRING_FIELD;\nvar BUILTIN_CLASS_BOOLEAN = 'Boolean';\nexports.BUILTIN_CLASS_BOOLEAN = BUILTIN_CLASS_BOOLEAN;\nvar BUILTIN_CLASS_DATE = 'Date';\nexports.BUILTIN_CLASS_DATE = BUILTIN_CLASS_DATE;\nvar BUILTIN_CLASS_ERROR = 'Error';\nexports.BUILTIN_CLASS_ERROR = BUILTIN_CLASS_ERROR;\nvar BUILTIN_TYPE_NOT_FINITE = 'NF';\nexports.BUILTIN_TYPE_NOT_FINITE = BUILTIN_TYPE_NOT_FINITE;\nvar BUILTIN_TYPE_UNDEFINED = 'UD';\nexports.BUILTIN_TYPE_UNDEFINED = BUILTIN_TYPE_UNDEFINED;\n\n\n//# sourceURL=webpack://esserializer/./src/utils/constant.ts?");

/***/ }),

/***/ "./src/utils/deserializer.ts":
/*!***********************************!*\
  !*** ./src/utils/deserializer.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("/**\n * Created by cshao on 2021-02-19.\n */\n\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.getParentClassName = exports.getClassMappingFromClassArray = exports.deserializeFromParsedObjWithClassMapping = exports.deserializeFromParsedObj = void 0;\nvar general_1 = __webpack_require__(/*! ./general */ \"./src/utils/general.ts\");\nvar constant_1 = __webpack_require__(/*! ./constant */ \"./src/utils/constant.ts\");\nvar REGEXP_BEGIN_WITH_CLASS = /^\\s*class\\s+/;\nfunction deserializeFromParsedObj(parsedObj, classes) {\n    return deserializeFromParsedObjWithClassMapping(parsedObj, getClassMappingFromClassArray(classes));\n}\nexports.deserializeFromParsedObj = deserializeFromParsedObj;\nfunction deserializeFromParsedObjWithClassMapping(parsedObj, classMapping) {\n    if (general_1.notObject(parsedObj)) {\n        return parsedObj;\n    }\n    if (Array.isArray(parsedObj)) {\n        return parsedObj.map(function (item) {\n            return deserializeFromParsedObjWithClassMapping(item, classMapping);\n        });\n    }\n    var classNameInParsedObj = parsedObj[constant_1.CLASS_NAME_FIELD];\n    switch (classNameInParsedObj) {\n        case constant_1.BUILTIN_TYPE_UNDEFINED:\n            return undefined;\n        case constant_1.BUILTIN_TYPE_NOT_FINITE:\n            return general_1.getValueFromToStringResult(parsedObj[constant_1.TO_STRING_FIELD]);\n        case constant_1.BUILTIN_CLASS_BOOLEAN:\n            return deserializeBoolean(parsedObj);\n        case constant_1.BUILTIN_CLASS_DATE:\n            return deserializeDate(parsedObj);\n        case constant_1.BUILTIN_CLASS_ERROR:\n            return deserializeError(parsedObj);\n    }\n    if (classNameInParsedObj && !classMapping[classNameInParsedObj]) {\n        throw new Error(\"Class \" + classNameInParsedObj + \" not found\");\n    }\n    var deserializedObj = deserializeClassProperty(classMapping[classNameInParsedObj]);\n    return deserializeValuesWithClassMapping(deserializedObj, parsedObj, classMapping);\n}\nexports.deserializeFromParsedObjWithClassMapping = deserializeFromParsedObjWithClassMapping;\nfunction deserializeBoolean(parsedObj) {\n    return new Boolean(parsedObj[constant_1.BOOLEAN_FIELD]);\n}\nfunction deserializeDate(parsedObj) {\n    return typeof parsedObj[constant_1.TIMESTAMP_FIELD] === 'number' ? new Date(parsedObj[constant_1.TIMESTAMP_FIELD]) : null;\n}\nfunction deserializeError(parsedObj) {\n    var error;\n    if (parsedObj.message) {\n        error = new Error(parsedObj.message);\n    }\n    else {\n        error = new Error();\n    }\n    delete error.stack;\n    if (parsedObj.name) {\n        error.name = parsedObj.name;\n    }\n    if (parsedObj.stack) {\n        error.stack = parsedObj.stack;\n    }\n    return error;\n}\nfunction deserializeClassProperty(classObj) {\n    var deserializedObj = {};\n    if (!classObj) {\n        return deserializedObj;\n    }\n    if (REGEXP_BEGIN_WITH_CLASS.test(classObj.toString())) {\n        Object.setPrototypeOf(deserializedObj, classObj ? classObj.prototype : Object.prototype);\n    }\n    else { // It's class in function style.\n        deserializedObj = Object.create(classObj.prototype.constructor.prototype);\n        classObj.prototype.constructor.call(deserializedObj);\n    }\n    return deserializedObj;\n}\nfunction deserializeValuesWithClassMapping(deserializedObj, parsedObj, classMapping) {\n    for (var k in parsedObj) {\n        if (k === constant_1.CLASS_NAME_FIELD) {\n            continue;\n        }\n        deserializedObj[k] = deserializeFromParsedObjWithClassMapping(parsedObj[k], classMapping);\n    }\n    return deserializedObj;\n}\n/**\n *\n * @param classes It's an array of Class definition. \"any\" is used in code only\n * because there is no TypeScript type definition for Class.\n */\nfunction getClassMappingFromClassArray(classes) {\n    if (classes === void 0) { classes = []; }\n    var classMapping = {};\n    classes.forEach(function (c) {\n        if (!general_1.isClass(c)) {\n            return;\n        }\n        // @ts-ignore\n        classMapping[c.name] = c;\n    });\n    return classMapping;\n}\nexports.getClassMappingFromClassArray = getClassMappingFromClassArray;\n/**\n *\n * @param classObj It's a Class definition. \"any\" is used in code only\n * because there is no TypeScript type definition for Class.\n */\nfunction getParentClassName(classObj) {\n    return classObj.prototype.__proto__.constructor.name;\n}\nexports.getParentClassName = getParentClassName;\n\n\n//# sourceURL=webpack://esserializer/./src/utils/deserializer.ts?");

/***/ }),

/***/ "./src/utils/general.ts":
/*!******************************!*\
  !*** ./src/utils/general.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("/**\n * Created by cshao on 2021-02-19.\n */\n\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.isClass = exports.notObject = exports.getValueFromToStringResult = void 0;\nfunction notObject(target) {\n    return target === null || typeof target !== 'object';\n}\nexports.notObject = notObject;\nfunction getValueFromToStringResult(result) {\n    switch (result) {\n        case 'Infinity':\n            return Infinity;\n        case '-Infinity':\n            return -Infinity;\n        case 'NaN':\n            return NaN;\n        default:\n            return null;\n    }\n}\nexports.getValueFromToStringResult = getValueFromToStringResult;\nfunction isSupportedBuiltinClass(target) {\n    return [Date].indexOf(target) >= 0;\n}\nfunction isClass(target) {\n    if (isSupportedBuiltinClass(target)) {\n        return true;\n    }\n    // Adopt solution from https://stackoverflow.com/a/46759625/707451\n    try {\n        Reflect.construct(String, [], target);\n    }\n    catch (e) {\n        return false;\n    }\n    return true;\n}\nexports.isClass = isClass;\n\n\n//# sourceURL=webpack://esserializer/./src/utils/general.ts?");

/***/ }),

/***/ "./src/utils/serializer.ts":
/*!*********************************!*\
  !*** ./src/utils/serializer.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("/**\n * Created by cshao on 2021-02-18.\n */\n\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.getSerializeValueWithClassName = void 0;\nvar constant_1 = __webpack_require__(/*! ./constant */ \"./src/utils/constant.ts\");\nvar general_1 = __webpack_require__(/*! ./general */ \"./src/utils/general.ts\");\nfunction getSerializeValueWithClassName(target) {\n    var _a, _b;\n    if (target === undefined) {\n        return _a = {},\n            _a[constant_1.CLASS_NAME_FIELD] = constant_1.BUILTIN_TYPE_UNDEFINED,\n            _a;\n    }\n    // Infinity, -Infinity, NaN\n    if (typeof target === 'number' && !isFinite(target)) {\n        return _b = {},\n            _b[constant_1.CLASS_NAME_FIELD] = constant_1.BUILTIN_TYPE_NOT_FINITE,\n            _b[constant_1.TO_STRING_FIELD] = target.toString(),\n            _b;\n    }\n    if (general_1.notObject(target)) {\n        return target;\n    }\n    if (Array.isArray(target)) {\n        return target.map(function (t) {\n            return getSerializeValueWithClassName(t);\n        });\n    }\n    var serializedObj = {};\n    for (var k in target) {\n        // @ts-ignore\n        serializedObj[k] = getSerializeValueWithClassName(target[k]);\n    }\n    return appendClassInfo(target, serializedObj);\n}\nexports.getSerializeValueWithClassName = getSerializeValueWithClassName;\nfunction appendClassInfo(target, serializedObj) {\n    var className = target.__proto__.constructor.name;\n    if (className !== 'Object') {\n        // @ts-ignore\n        serializedObj[constant_1.CLASS_NAME_FIELD] = className;\n        if (className === constant_1.BUILTIN_CLASS_BOOLEAN) {\n            serializedObj[constant_1.BOOLEAN_FIELD] = target.valueOf();\n        }\n        else if (className === constant_1.BUILTIN_CLASS_DATE) {\n            serializedObj[constant_1.TIMESTAMP_FIELD] = target.getTime();\n        }\n        else if (className === constant_1.BUILTIN_CLASS_ERROR) {\n            var error = target;\n            if (error.name !== 'Error') {\n                serializedObj.name = error.name;\n            }\n            if (error.message) {\n                serializedObj.message = error.message;\n            }\n            if (error.stack) {\n                serializedObj.stack = error.stack;\n            }\n        }\n    }\n    return serializedObj;\n}\n\n\n//# sourceURL=webpack://esserializer/./src/utils/serializer.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.ts");
/******/ })()

));