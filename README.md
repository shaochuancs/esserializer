![CircleCI](https://circleci.com/gh/shaochuancs/esserializer.svg?style=shield)
[![Coverage Status](https://coveralls.io/repos/github/shaochuancs/esserializer/badge.svg?branch=master)](https://coveralls.io/github/shaochuancs/esserializer?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/dc4d2ca88c7cc8467b81/maintainability)](https://codeclimate.com/github/shaochuancs/esserializer/maintainability)

# esserializer
ESSerializer is an ECMAScript serialization and deserialization utility.

With ESSerializer, you can serialize JavaScript class instance in JSON format, and later on deserialize it into an instance object, with all Class/Property/Method etc. retained. 
This works in both browser and Node.js environment. ESSerializer also support almost all builtin classes and types.

ESSerializer support following features:
* Retain class information of instance field value
* Retain class extension structure
* Support both ES6 class and old function style class
* Support following operator: 
  * getter & setter
  * instanceof
* Support following JavaScript builtin class and type: 
  * Array (and all 11 specific array types) 
  * BigInt
  * Boolean
  * Date
  * Error (and all 7 sub-error classes)
  * Infinity
  * NaN
  * RegExp
  * Set
  * String
  * undefined
  * Symbol (with ESSerializer Pro)
* Support circular structure (with ESSerializer Pro)

## Installation
```sh
$ npm install esserializer --save
```

## Usage
To serialize JavaScript object, invoke ESSerializer's `serialize` method:
```js
const ESSerializer = require('esserializer');
const SomeClass = require('./SomeClass');

let obj = new SomeClass();
// do something here...
let serializedString = ESSerializer.serialize(obj);
console.log(serializedString);
```

To deserialize text and turn it into an corresponding instance object, invoke ESSerializer's `deserialize` method, 
with all involved custom classes as parameter (you don't need to include builtin classes such as `Date` in this parameter):

```js
const ESSerializer = require('esserializer');
const SomeClass = require('./SomeClass');
const AnotherInvolvedClass = require('./AnotherInvolvedClass');

let classes = [SomeClass, AnotherInvolvedClass];
let deserializedObj = ESSerializer.deserialize(serializedString, classes);
console.log(deserializedObj);
```

Please check the `/demo` directory in source code for all examples.

## ESSerializer Pro
With a cup of coffee ($5), you can download ESSerializer Pro and get following additional features:
* Support circular structure
* Support additional builtin object and type: Symbol

Please contact shaochuancs@gmail.com if you are interested.

## License
(The MIT License for ESSerializer and private license for ESSerializer Pro)

Copyright (c) 2019-2021 Chuan Shao &lt;shaochuancs@gmail.com&gt;
