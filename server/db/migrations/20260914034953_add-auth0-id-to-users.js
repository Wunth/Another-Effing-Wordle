/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('auth0_id').unique()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function down(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('auth0_id')
  })
}
