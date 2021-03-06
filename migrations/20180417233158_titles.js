exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('titles', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.integer('number');
      table.string('username').notNullable().references('username').inTable('users');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('titles'),
  ]);
};
