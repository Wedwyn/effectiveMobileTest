export const up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('firstname');
    table.string('surname');
    table.string('email');
    table.integer('age');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};

export const down = (knex) => {
  return knex.schema.dropTable('users');
};
