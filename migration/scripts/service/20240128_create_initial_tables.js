exports.up = function (knex) {
  return knex.schema.createTable('urlMapper', function (table) {
    table.increments('id').primary().index();
    table.string('longUrl', 5000).unique().notNullable().index();
    table.string('hash', 10).unique().notNullable().index();
    table.integer('accessCount').defaultTo(0);
    table.string('createdBy', 255).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  }).then(() => {
    return knex.schema.createTable('requestByWeek', function (table) {
      table.increments('id').primary().index();
      table.integer('urlMapper_id').unsigned().notNullable().index();
      table.string('weekStartDate', 255).notNullable().index();
      table.integer('count').notNullable();
      table.foreign('urlMapper_id')
        .references('id')
        .inTable('urlMapper')
        .onDelete('CASCADE');
      table.unique(['urlMapper_id', 'weekStartDate']);
    });
  }).then(() => {
    return knex.schema.createTable('requestByMonth', function (table) {
      table.increments('id').primary().index();
      table.integer('urlMapper_id').unsigned().notNullable().index();
      table.string('monthStartDate', 255).notNullable().index();
      table.integer('count').notNullable();
      table.foreign('urlMapper_id')
        .references('id')
        .inTable('urlMapper')
        .onDelete('CASCADE');
      table.unique(['urlMapper_id', 'monthStartDate']);
    });
  }).then(() => {
    return knex.schema.createTable('requestByDevice', function (table) {
      table.increments('id').primary().index();
      table.integer('urlMapper_id').unsigned().notNullable().index();
      table.string('device', 255).notNullable().index();
      table.integer('count').notNullable();
      table.foreign('urlMapper_id')
        .references('id')
        .inTable('urlMapper')
        .onDelete('CASCADE');
      table.unique(['urlMapper_id', 'device']);
    });
  }).then(() => {
    return knex.schema.createTable('requestByOperationalSystem', function (table) {
      table.increments('id').primary().index();
      table.integer('urlMapper_id').unsigned().notNullable().index();
      table.string('operationalSystem', 255).notNullable().index();
      table.integer('count').notNullable();
      table.foreign('urlMapper_id')
        .references('id')
        .inTable('urlMapper')
        .onDelete('CASCADE');
      table.unique(['urlMapper_id', 'operationalSystem']);
    });
  }).then(() => {
    return knex.schema.createTable('requestByBrowser', function (table) {
      table.increments('id').primary().index();
      table.integer('urlMapper_id').unsigned().notNullable().index();
      table.string('browser', 255).notNullable().index();
      table.integer('count').notNullable();
      table.foreign('urlMapper_id')
        .references('id')
        .inTable('urlMapper')
        .onDelete('CASCADE');
      table.unique(['urlMapper_id', 'browser']);
    });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('requestByBrowser')
    .then(() => knex.schema.dropTableIfExists('requestByOperationalSystem'))
    .then(() => knex.schema.dropTableIfExists('requestByDevice'))
    .then(() => knex.schema.dropTableIfExists('requestByMonth'))
    .then(() => knex.schema.dropTableIfExists('requestByWeek'))
    .then(() => knex.schema.dropTableIfExists('urlMapper'));
};
