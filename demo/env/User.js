/**
 * Created by cshao on 2021/12/6
 */

'use strict';

class User {
  constructor(id) {
    this.id = id;
    this._location = {
      province: null,
      city: null
    };

    Object.defineProperties(this, {
      location: {
        enumerable: true,
        configurable: false,
        get: () => {
          return this._location.province + ' : ' + this._location.city;
        },
        set: (loc) => {
          const locArr = loc.split('_');
          this._location.province = locArr[0];
          this._location.city = locArr[1];
        }
      }
    });
  }
}

module.exports = User;
