import BaseModel from './BaseModel.js';

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstname', 'surname', 'email', 'age'],
      properties: {
        id: { type: 'integer' },
        firstname: { type: 'string', minLength: 1 },
        surname: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        age: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  get name() {
    return `${this.firstname} ${this.surname}`;
  }
}

export default User;
