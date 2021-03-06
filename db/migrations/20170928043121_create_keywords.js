
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('keywords', function (table) {
            table.increments();
            table.string('key');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.integer('categories_id').unsigned().references('id').inTable('categories').notNull().onDelete('cascade');

        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('keywords')
    ])
};
