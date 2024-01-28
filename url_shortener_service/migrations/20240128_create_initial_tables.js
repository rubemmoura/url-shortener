exports.up = function (knex) {
  return knex.schema.createTable('urlMapper', function (table) {
    table.increments('id').primary();
    table.string('longUrl', 255).unique().notNullable();
    table.string('hash', 255).unique().notNullable();
    table.integer('accessCount').defaultTo(0);
    table.string('createdBy', 255).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('urlMapper')
};
