/**
 * Created by cshao on 2019-05-23.
 */

'use strict';

const SuperA = require('./SuperA');

class A extends SuperA {
  constructor(options) {
    super({xVal: 42});
    Object.assign(this.options, options);
    this._height = null;
  }

  get height() {
    return this._height+1;
  }

  set height(h) {
    this._height = h - 10;
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

  static staticMethodOfA() {
    console.log('Static A');
  }
}

module.exports = A;