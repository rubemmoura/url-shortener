exports.up = function (knex) {
  return knex.schema.createTable('user', function (table) {
    table.increments('id').primary();
    table.string('email', 255).unique().notNullable();
    table.string('password', 255).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user');
};
