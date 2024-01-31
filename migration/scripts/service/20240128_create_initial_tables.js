exports.up = function (knex) {
  return knex.schema.createTable('urlMapper', function (table) {
    table.increments('id').primary();
    table.string('longUrl', 5000).unique().notNullable();
    table.string('hash', 10).unique().notNullable();
    table.integer('accessCount').defaultTo(0);
    table.string('createdBy', 255).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  }).then(() => {
    return knex.schema.createTable('request', function (table) {
      table.increments('id').primary();
      table.integer('urlMapper_id').unsigned().notNullable();
      table.string('device', 255).notNullable();
      table.string('operationalSystem', 255).notNullable();
      table.string('country', 255).notNullable();
      table.string('browser', 255).notNullable();
      table.string('city', 255).notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.foreign('urlMapper_id')
        .references('id')
        .inTable('urlMapper')
        .onDelete('CASCADE');
    });
  })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('request').then(() => {
    return knex.schema.dropTableIfExists('urlMapper');
  });
};
