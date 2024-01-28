exports.up = function (knex) {
  return knex.schema.createTable('role', function (table) {
    table.increments('id').primary();
    table.string('name', 255).unique().notNullable();
  }).then(() => {
    return knex('role').insert([
      { name: 'ADMIN' },
      { name: 'USER' }
    ]);
  }).then(() => {
    return knex.schema.createTable('user', function (table) {
      table.increments('id').primary();
      table.string('email', 255).unique().notNullable();
      table.string('password', 255).notNullable();
      table.integer('role_id').unsigned().notNullable();
      table.foreign('role_id').references('id').inTable('role');
    });
  }).then(() => {
    return knex.schema.createTable('blackList', function (table) {
      table.increments('id').primary();
      table.string('token', 255).notNullable();
    });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user').then(() => {
    return knex.schema.dropTableIfExists('role');
  }).then(() => {
    return knex.schema.dropTableIfExists('blackList');
  });
};
