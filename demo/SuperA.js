/**
 * Created by cshao on 2019-05-23.
 */

'use strict';

class SuperA {
  constructor(options) {
    this.options = (options && (typeof options === 'object')) ? options : {};
  }

  getOptions() {
    return this.options;
  }

  setOptions(options) {
    this.options = options;
  }

  methodOfSuperA() {
    console.log('SuperA');
  }
}

module.exports = SuperA;