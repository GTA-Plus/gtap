
exports.up = function(knex) {
    const users_table = `
    CREATE TABLE users(   
        game_licence VARCHAR(255) NOT NULL,
        cash INT DEFAULT 10000,
        bank INT DEFAULT 10000,
        PRIMARY KEY (game_licence)
    )
    `
    return knex.raw(users_table)
};

exports.down = function(knex) {
    return knex.raw('DROP TABLE users')
};
