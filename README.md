![CircleCI](https://circleci.com/gh/shaochuancs/esserializer.svg?style=shield)
[![Coverage Status](https://coveralls.io/repos/github/shaochuancs/esserializer/badge.svg?branch=master)](https://coveralls.io/github/shaochuancs/esserializer?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/dc4d2ca88c7cc8467b81/maintainability)](https://codeclimate.com/github/shaochuancs/esserializer/maintainability)

# esserializer
ESSerializer is an ECMAScript serialization and deserialization utility.

With ESSerializer, you can serialize JavaScript class instance in JSON format, and later on deserialize it into an instance object, with all Class/Property/Method etc. retained. 
This works in both browser and Node.js environment. ESSerializer also support almost all builtin classes and types.

## Features
ESSerializer support following features:
* Retain class information of instance field value
* Retain class extension structure
* Support both ES6 class and old function style class
* Support following operator during serialization & deserialization: 
  * getter & setter
  * instanceof
* Support following JavaScript builtin class and type: 
  * Array (and all 11 specific array types) 
  * ArrayBuffer & SharedArrayBuffer
  * BigInt
  * Boolean
  * DataView
  * Date
  * Error (and all 7 sub-error classes)
  * Infinity
  * Intl (and all 7 specific internationalization classes)
  * Map (with ESSerializer Pro)
  * NaN
  * RegExp
  * Set
  * String
  * Symbol (with ESSerializer Pro)
  * undefined
* Support ignoring target properties during serialization
* Support intercept target properties during serialization
* Support circular structure (with ESSerializer Pro)

## Installation
```sh
$ npm install esserializer --save
```

## Usage

### Serialization
To serialize JavaScript object, invoke ESSerializer's `serialize` method:
```js
const ESSerializer = require('esserializer');
const ClassA = require('./ClassA');

let obj = new ClassA();
// do something here, such as obj.methodOfClassA(42)
let serializedString = ESSerializer.serialize(obj);
console.log(serializedString);
```

You can pass an options object during serialization and ignore unwanted properties, or intercept target properties:

```js
let serializedString = ESSerializer.serialize(obj, {
  ignoreProperties: ['unwantedFieldX', 'unwantedFieldY'],
  interceptProperties: {
    propertyX: function (value) {
      return value + 1;
    }
  }
});
```

### Deserialization
To deserialize text and turn it into a corresponding instance object, invoke ESSerializer's `deserialize` method, 
with all involved custom classes as parameter (you don't need to include builtin classes such as `Date` in this parameter):
```js
const ESSerializer = require('esserializer');
const ClassA = require('./ClassA');
const ClassB = require('./ClassB');
const ClassC = require('./ClassC');

let deserializedObj = ESSerializer.deserialize(serializedString, [ClassA, ClassB, ClassC]);
console.log(deserializedObj);
```

Or, you can register some classes globally. Once class is registered, it will be remembered by ESSerializer in all files:
```js
const ESSerializer = require('esserializer');
const ClassA = require('./ClassA');
const ClassB = require('./ClassB');
const ClassC = require('./ClassC');
ESSerializer.registerClasses([ClassA, ClassB, ClassC]);
let deserializedObj = ESSerializer.deserialize(serializedString);
console.log(deserializedObj);
```

Or, you can let ESSerializer intercept require operation and detect classes automatically. Once class is detected, it will
be remembered by ESSerializer in all files:
```js
const ESSerializer = require('esserializer');
ESSerializer.interceptRequire();
require('./ClassA');
require('./ClassB');
require('./ClassC');
let deserializedObj = ESSerializer.deserialize(serializedString);
console.log(deserializedObj);
```

Custom classes parameter / Class registry / Require interception, these 3 methods can be combined during deserialzation. 

### Demo
Please check the `/demo` directory in source code for all examples.

## ESSerializer Pro
With a cup of coffee ($5), you can download ESSerializer Pro and get following additional features:
* Support circular structure
* Support additional builtin object and type: 
  * Map
  * Symbol

Please contact shaochuancs@gmail.com if you are interested.

## License
(The MIT License for ESSerializer and private license for ESSerializer Pro)

Copyright (c) 2019-2021 Chuan Shao &lt;shaochuancs@gmail.com&gt;
