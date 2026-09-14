export async function seed(knex) {
  await knex('words').del()

  await knex('words').insert([
    {
      word: 'unc',
      success_message: 'Correct! That was some unc-tier problem solving.',
    },
    {
      word: 'skibidi',
      success_message: "Correct! Still don't know what it means though.",
    },
    {
      word: 'delulu',
      success_message: 'Solved it — no delusion required, for once.',
    },
    {
      word: 'brainrot',
      success_message: "Nice work! That's the last brain cell put to good use.",
    },
    {
      word: 'cheugy',
      success_message:
        'Correct! Somehow already out of style by the time you read this.',
    },
    {
      word: 'doomscrolling',
      success_message: 'Got it! Better use of your thumb than usual.',
    },
    {
      word: 'yapping',
      success_message: 'Solved! Finally, some productive yapping.',
    },
    {
      word: 'gyatt',
      success_message: 'Correct! Please explain this one to your parents.',
    },
    {
      word: 'goated',
      success_message: "Solved it! That's certified goated behavior.",
    },
    {
      word: 'npc',
      success_message: 'Nice — that was not an NPC-brained guess at all.',
    },
    {
      word: 'sussy',
      success_message: 'Correct! A little sussy that took you a while though.',
    },
    {
      word: 'glaze',
      success_message: "Correct! Okay, we'll stop glazing you now.",
    },
    {
      word: 'yeet',
      success_message: 'Yeeted that guess right into the correct answer.',
    },
    {
      word: 'wompwomp',
      success_message: 'Solved it! No womp womp energy here.',
    },
    {
      word: 'unhinged',
      success_message:
        "Solved it, in a completely unhinged number of guesses or not, we don't judge.",
    },
    { word: 'mewing', success_message: 'Nice jawline — I mean, nice guess.' },
    { word: 'rizz', success_message: 'Correct! Certified rizz, no cap.' },
    { word: 'slay', success_message: 'Slayed it. No further comments needed.' },
  ])
}
