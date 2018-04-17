
exports.up = function(knex, Promise) {
   return Promise.all([
    knex.schema.createTable('tweets', function(table) {
      table.increments('token').primary();
      table.string('username').notNullable().references('username').inTable('users');
    }),
  ]);
};

exports.down = function(knex, Promise) {
   return Promise.all([
    knex.schema.dropTable('tweets'),
  ]);
};
