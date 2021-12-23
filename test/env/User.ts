/**
 * Created by cshao on 2021/12/6
 */

'use strict';

class User {
  private idNum: string;
  private name: string;
  private readonly _location: { province: string; city: string };

  constructor(id, name) {
    this.idNum = id;
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
        value: this.idNum + '_' + this.name
      },
      displayObject: {
        enumerable: true,
        configurable: false,
        value: {
          identity: this.idNum,
          nickname: this.name
        }
      }
    });
  }
}

export default User;
