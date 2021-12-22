/**
 * Created by cshao on 2021/12/6
 */

'use strict';

class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
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
      },
      displayName: {
        enumerable: true,
        configurable: false,
        value: this.id + '_' + this.name
      }
    });
  }
}

module.exports = User;
