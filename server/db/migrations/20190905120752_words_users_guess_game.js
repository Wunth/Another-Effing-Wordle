// Create Words and Users tables first as games has foreign key constraints for both

export async function up(knex) {
  await knex.schema.createTable('words', (table) => {
    table.increments('id')
    table.string('word').notNullable()
  })

  await knex.schema.createTable('users', (table) => {
    table.increments('id')
    table.string('name').notNullable()
  })

  await knex.schema.createTable('games', (table) => {
    table.increments('id')
    table
      .integer('word_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('words')
      .onDelete('CASCADE')
    table.datetime('time_start')
    table.datetime('time_end')
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      // cascades the delete to connected data in other tables
      .onDelete('CASCADE')
  })

  await knex.schema.createTable('guess', (table) => {
    table.increments('id')
    table
      .integer('games_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('games')
      .onDelete('CASCADE')
    table.string('guess')
    table.datetime('time_submitted')
  })
}

export async function down(knex) {
  // Drop in reverse order so we never try to drop a table
  // that something else still has a foreign key into.
  await knex.schema.dropTableIfExists('guess')
  await knex.schema.dropTableIfExists('games')
  await knex.schema.dropTableIfExists('users')
  await knex.schema.dropTableIfExists('words')
}
