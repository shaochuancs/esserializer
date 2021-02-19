/**
 * Created by cshao on 2021-02-19.
 */

'use strict';

class ClassB {
  private _hobby: string;
  constructor() {
    this._hobby = null;
  }

  get hobby(): string {
    return this._hobby;
  }

  set hobby(value: string) {
    this._hobby = value;
  }
}

export default ClassB;