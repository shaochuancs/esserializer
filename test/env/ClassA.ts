/**
 * Created by cshao on 2021-02-19.
 */

'use strict';

class ClassA {
  private _name: string;
  constructor() {
    this._name = null;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}

export default ClassA;