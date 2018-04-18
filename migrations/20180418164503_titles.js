exports.up = function(knex, Promise) {
  return Promise.all([
	knex.schema.createTable('titles', function(table){
		table.string('title').primary();
		table.string('type');
		table.string('username').primary();
		table.integer('number');
	}),
  ]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
	knex.schema.dropTable('titles'),
]);  
};
