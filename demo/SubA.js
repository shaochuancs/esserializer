/**
 * Created by cshao on 2019-05-23.
 */

'use strict';

const A = require('./A');

class SubA extends A {
  constructor(options) {
    super({xVal: 88, yVal: 99});
    Object.assign(this.options, options);
  }

  getOptions() {
    return this.options;
  }

  setOptions(options) {
    this.options = options;
  }

  methodOfSubA() {
    console.log('SubA');
  }
}

module.exports = SubA;