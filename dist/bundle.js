!function(e,r){for(var t in r)e[t]=r[t];r.__esModule&&Object.defineProperty(e,"__esModule",{value:!0})}(exports,(()=>{"use strict";var e={607:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0});var n=t(810),a=t(496),o=function(){function e(){}return e.serialize=function(e){return JSON.stringify(n.getSerializeValueWithClassName(e))},e.deserialize=function(e,r){return a.deserializeFromParsedObj(JSON.parse(e),r)},e}();e.exports=o},917:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.CLASS_NAME_FIELD=void 0,r.CLASS_NAME_FIELD="className"},496:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.getParentClassName=r.getClassMappingFromClassArray=r.deserializeFromParsedObjWithClassMapping=r.deserializeFromParsedObj=void 0;var n=t(821),a=t(917),o=/^\s*class\s+/;function i(e,r){if(n.notObject(e))return e;var t={},s=e[a.CLASS_NAME_FIELD];if(s){if("Date"===s)return"number"==typeof e.timestamp?new Date(e.timestamp):null;var u=r[s];o.test(u.toString())?Object.setPrototypeOf(t,u?u.prototype:Object.prototype):(t=Object.create(u.prototype.constructor.prototype),u.prototype.constructor.call(t))}for(var c in e)if(c!==a.CLASS_NAME_FIELD){var l=e[c];Array.isArray(l)?t[c]=l.map((function(e){return i(e,r)})):t[c]=i(l,r)}return t}function s(e){void 0===e&&(e=[]);var r={};return[Date].concat(e).forEach((function(e){n.isClass(e)&&(r[e.name]=e)})),r}r.deserializeFromParsedObj=function(e,r){return i(e,s(r))},r.deserializeFromParsedObjWithClassMapping=i,r.getClassMappingFromClassArray=s,r.getParentClassName=function(e){return e.prototype.__proto__.constructor.name}},821:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.isClass=r.notObject=void 0,r.notObject=function(e){return null===e||"object"!=typeof e},r.isClass=function(e){if(function(e){return[Date].indexOf(e)>=0}(e))return!0;try{Reflect.construct(String,[],e)}catch(e){return!1}return!0}},810:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.getSerializeValueWithClassName=void 0;var n=t(917),a=t(821);r.getSerializeValueWithClassName=function e(r){if(a.notObject(r))return r;if(Array.isArray(r))return r.map((function(r){return e(r)}));var t={};for(var o in r)t[o]=e(r[o]);var i=r.__proto__.constructor.name;return"Object"!==i&&(t[n.CLASS_NAME_FIELD]=i,"Date"===i&&(t.timestamp=r.getTime())),t}}},r={};return function t(n){if(r[n])return r[n].exports;var a=r[n]={exports:{}};return e[n](a,a.exports,t),a.exports}(607)})());