
exports.up = function(knex, Promise) {
    return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.string('username').primary();
      table.string('password');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
  ]);
};
