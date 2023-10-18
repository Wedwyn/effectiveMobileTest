export const up = (knex) => {
  return knex.schema.createTable('users_actions', (table) => {
    table.increments('id').primary();
    table.integer('user_id');
    table.string('action_type');
    table.jsonb('changed_fields');
    table.timestamp('action_time');
  });
};

export const down = (knex) => {
  return knex.schema.dropTable('users_actions');
};
