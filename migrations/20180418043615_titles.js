
exports.up = function(knex, Promise) {
  return Promise.all([
	knex.schema.createTable('titles', function(table){
		table.unique(['title', 'username']);
		table.string('title');
		table.string('type');
		table.string('username');
		table.integer('number');
	}),
  ]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
	knex.schema.dropTable('titles'),
]);  
};
