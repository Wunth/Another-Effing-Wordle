export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('words').del()
  await knex('users').del()

  await knex('users').insert([{ name: 'anonymous' }])

  await knex('words').insert([
    { word: 'phuck', success_message: 'Well done - you didnt phuck it up!' },
    {
      word: 'phuckinell',
      success_message: "Phuckinell, you've bloody done it!",
    },
    {
      word: 'givsaphuck',
      success_message:
        'Nice work, you can tell your friends and family now, but nobody really givsaphuck!',
    },
    {
      word: 'furkinell',
      success_message: '"Furkinell you solved that AFW!", said noone ever.',
    },
    { word: 'schidabryk', success_message: 'Not enough fibre' },
    {
      word: 'dambit',
      success_message: "Dambit if 2020 doesn't look so bad nowadays",
    },
    {
      word: 'balzak',
      success_message:
        'Balzak: scrotum (not to be confused with the French novelist Honoré de Balzac, which apparently used to happen to him a lot)',
    },
    { word: 'dix', success_message: 'Too many of them on the dance floor' },
    {
      word: 'bewbs',
      success_message:
        'If I gave you compliments, would you hold them against me?',
    },
    {
      word: 'tiddies',
      success_message: "Congrats! We're all getting dumber in real time!",
    },
    {
      word: 'phunbags',
      success_message: 'Well done, nothing wrong with phunbags!',
    },
    {
      word: 'muddafuh',
      success_message:
        'Hey muddafuh, you been staring at me for the last 2 minutes?',
    },
    { word: 'mothertrucker', success_message: 'Big rig' },
    {
      word: 'skibbidi',
      success_message: 'Correct! But nobody knows what it means.',
    },
    {
      word: 'bloodyhayew',
      success_message: 'What the bloodyhayew was that all about?',
    },
  ])
}
