/**
 * Created by cshao on 2019-05-23.
 */

'use strict';

const SuperClassA = require('./SuperClassA');

class ClassA extends SuperClassA {
  constructor(options) {
    super({zVal: 42});
    Object.assign(this.options, options);
    this._height = null;
  }

  get height() {
    return this._height;
  }

  set height(h) {
    this._height = h;
  }

  getOptions() {
    return this.options;
  }

  setOptions(options) {
    this.options = options;
  }

  methodOfClassA() {
    console.log('Method of ClassA invoked');
  }

  static staticMethodOfClassA() {
    console.log('Static method of ClassA invoked');
  }
}

module.exports = ClassA;
