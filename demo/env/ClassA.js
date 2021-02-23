/**
 * Created by cshao on 2019-05-23.
 */

'use strict';

const SuperClassA = require('./SuperClassA');

class ClassA extends SuperClassA {
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

  methodOfClassA() {
    console.log('ClassA');
  }

  static staticMethodOfClassA() {
    console.log('Static of ClassA');
  }
}

module.exports = ClassA;