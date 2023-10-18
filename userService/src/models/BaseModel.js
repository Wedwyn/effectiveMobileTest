import { AjvValidator, Model } from 'objection';
import addFormats from 'ajv-formats';
import knex from 'knex';
import { development } from '../../knexfile.js';

Model.knex(knex(development));

class BaseModel extends Model {
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
      },
      options: {
        allErrors: true,
        validateSchema: false,
        ownProperties: true,
        v5: true,
      },
    });
  }
}

export default BaseModel;
