/*
 * @flow
 */

import FS from 'file-saver';

export default class FileSaver {

  static saveFile(entityData :{}, name :string, datatype :string, success? :?(datatype :string) => void) {
    let contentType = 'application/json';
    let data = entityData;

    if (datatype === 'json') {
      contentType = 'text/json';
      data = JSON.stringify(entityData);
    }

    const blob = new Blob([data], {
      type: contentType
    });

    FS.saveAs(blob, name.concat(
      (datatype === 'json') ? '.json' : '.csv'
    ));
    if (success && success !== undefined) {
      success(datatype);
    }
  }
}
