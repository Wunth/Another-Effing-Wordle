export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('words').del()
  await knex('users').del()

  await knex('users').insert([
    { name: 'anonymous' },
  ])

  await knex('words').insert([
    { word: 'phuck' },
    { word: 'phuckinell' },
    { word: 'givsaphuck' },
    { word: 'furkinell' },
    { word: 'schidabryk' },
    { word: 'dambit' },
    { word: 'balzak' },
    { word: 'dix' },
    { word: 'bewbs' },
    { word: 'tiddies' },
    { word: 'phunbags' },
    { word: 'Muddafuh' },
    { word: 'Mothertrucker' },
    { word: 'skibbidi' },
  ])
}