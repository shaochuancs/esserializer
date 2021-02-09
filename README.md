# esserializer
ESSerializer is an ECMAScript serialization and deserialization utility

With ESSerializer, you can serialize JavaScript class instance, and later on deserialize it into an instance object, with all Class/Property/Method etc. retained.

## Installation
```sh
$ npm install esserializer --save
```

## Usage
To serialize JavaScript object, invoke ESSerializer's `serialize` method:
```js
const ESSerializer = require('esserializer');
const SubA = require('./SubA');

let subAObj = new SubA({xVal: 666, zVal: 231});
let serializedString = ESSerializer.serialize(subAObj);
console.log(serializedString);
```

To deserialize text and turn it into an corresponding instance object, invoke ESSerializer's `deserialize` method, with all involved classes as parameter:

```js
const ESSerializer = require('esserializer');
const SuperA = require('./SuperA');
const A = require('./A');
const SubA = require('./SubA');
let classes = [SuperA, A, SubA];

let deserializedObj = ESSerializer.deserialize(serializedString, classes);
console.log(deserializedObj);

deserializedObj.methodOfSuperA();
```

Please check the `/demo` directory in source code for full example.

## License
(The MIT License)

Copyright (c) 2019-2021 Chuan Shao &lt;shaochuancs@gmail.com&gt;
