/**
 * Created by cshao on 2019-05-23.
 */

'use strict';

const SuperA = require('./SuperA');

class A extends SuperA {
  constructor(options) {
    super({xVal: 42});
    Object.assign(this.options, options);
  }

  getOptions() {
    return this.options;
  }

  setOptions(options) {
    this.options = options;
  }

  methodOfA() {
    console.log('A');
  }
}

module.exports = A;