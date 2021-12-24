/**
 * Created by cshao on 2021/12/21
 */

'use strict';

interface DeserializeOptions {
  fieldsForConstructorParameters?: Array<string>,
  ignoreProperties?: Array<string>,
  rawProperties?: Array<string>
}

export default DeserializeOptions;
