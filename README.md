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
* Support ignoring target properties during serialization or deserialization
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

const obj = new ClassA();
// do something here, such as obj.methodOfClassA()
const serializedString = ESSerializer.serialize(obj);
```

### Deserialization
To deserialize text and turn it into a corresponding instance object, invoke ESSerializer's `deserialize` method,
with all involved custom classes as parameter (you don't need to include builtin classes such as `Date` in this parameter):
```js
const ESSerializer = require('esserializer');
const ClassA = require('./ClassA');
const ClassB = require('./ClassB');
const ClassC = require('./ClassC');

const deserializedObj = ESSerializer.deserialize(serializedString, [ClassA, ClassB, ClassC]);
```

## Demo
Please check the [demo](https://github.com/shaochuancs/esserializer/tree/master/demo) page for all examples:
* [basic.js](https://github.com/shaochuancs/esserializer/blob/master/demo/basic.js)
* [support_of_OO_extension.js](https://github.com/shaochuancs/esserializer/blob/master/demo/support_of_OO_extension.js)
* [support_of_array.js](https://github.com/shaochuancs/esserializer/blob/master/demo/support_of_array.js)
* [support_of_builtin_types.js](https://github.com/shaochuancs/esserializer/blob/master/demo/support_of_builtin_types.js)
* [support_of_date.js](https://github.com/shaochuancs/esserializer/blob/master/demo/support_of_date.js)
* [support_of_deserialize_options.js](https://github.com/shaochuancs/esserializer/blob/master/demo/support_of_deserialize_options.js)
* [support_of_function_style_class_definition.js](https://github.com/shaochuancs/esserializer/blob/master/demo/support_of_function_style_class_definition.js)
* [support_of_intercept_require.js](https://github.com/shaochuancs/esserializer/blob/master/demo/support_of_intercept_require.js)
* [support_of_properties_defined_in_constructor.js](https://github.com/shaochuancs/esserializer/blob/master/demo/support_of_properties_defined_in_constructor.js)
* [support_of_register_classes.js](https://github.com/shaochuancs/esserializer/blob/master/demo/support_of_register_classes.js)
* [support_of_serialize_options.js](https://github.com/shaochuancs/esserializer/blob/master/demo/support_of_serialize_options.js)

## Advanced usage

### Serialization
You can also pass an options object during serialization and ignore unwanted properties, or intercept target properties:

```js
const serializedString = ESSerializer.serialize(obj, {
  ignoreProperties: ['unwantedFieldX', 'unwantedFieldY'],
  interceptProperties: {
    propertyX: function (value) {
      return value + 1; // After serialization, value of propertyX would be equal to its original value plus 1. Also, "this" can be used here to represent obj.
    }
  }
});
```

Serialization options:

| Option              | Type   | Description                                                                                                                                                                            |
|---------------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ignoreProperties    | Array  | Array of string, represent all properties that would be ignored.                                                                                                                       |
| interceptProperties | Object | Object whose key represents property to be intercepted, and its Function value represents how to intercept. The function would take properties' original value as its first parameter. |

### Deserialization
You can also register some classes globally for deserialization. Once class is registered, it will be remembered by ESSerializer in all files:
```js
ESSerializer.registerClasses([ClassA, ClassB, ClassC]);
const deserializedObj = ESSerializer.deserialize(serializedString);
```

Or, you can let ESSerializer intercept require operation and detect classes automatically. Once class is detected, it will
be remembered by ESSerializer in all files:
```js
ESSerializer.interceptRequire();
require('./ClassA');
require('./ClassB');
require('./ClassC');
const deserializedObj = ESSerializer.deserialize(serializedString);
```

Custom-Classes-Parameter / Class-Registry / Require-Interception, these 3 methods can be used in combination during deserialzation. 

During deserialization, you can also pass an options object to indicate which fields of parsed object can be used as constructor parameters:

```js
const User = require('./User');
const serializedString = '{"idNum":"P123456","name":"Mike","ess_cn":"User"}';
const deserializedObj = ESSerializer.deserialize(serializedString, [User], {
  fieldsForConstructorParameters: ['idNum', 'name']
}); // value of field 'idNum' ('P123456') and 'name' ('Mike') will be used as constructor parameters to initialize User instance.
```

Deserialization options:

| Option                         | Type  | Description                                                                                                                                                                            |
|--------------------------------|-------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fieldsForConstructorParameters | Array | Array of string, represent fields of parsed object whose value would be used as constructor parameters.                                                                                |
| ignoreProperties               | Array | Array of string, represent all properties that would be ignored.                                                                                                                       |
| rawProperties                  | Array | Array of string, represent all properties whose raw text value would be retained in deserialization result.                                                                            |

## ESSerializer Pro
With a cup of coffee ($5), you can download & update ESSerializer Pro and get following additional features:
* Support circular structure
* Support additional builtin object and type: 
  * Map
  * Symbol

Please contact shaochuancs@gmail.com if you are interested.

## License
(The MIT License for ESSerializer and private license for ESSerializer Pro)

Copyright (c) 2019-2022 Chuan Shao &lt;shaochuancs@gmail.com&gt;
