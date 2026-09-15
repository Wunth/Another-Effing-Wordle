export async function seed(knex) {
  await knex('games').del()

  const user = await knex('users').where({ id: 1 }).first()
  if (!user) {
    console.log(
      'No user with id 1 found yet — log in first, then re-run this seed.',
    )
    return
  }

  const words = await knex('words').select('id', 'word')
  if (words.length === 0) {
    console.log('No words found — run the words seed first.')
    return
  }

  const now = Date.now()
  const rows = []

  // 10 dummy games, spaced going back in time, each solved in a
  // different amount of time (1–5 minutes) for variety
  const gameCount = 10
  for (let i = 0; i < gameCount; i++) {
    const word = words[i % words.length]
    const minutesAgoStarted = (gameCount - i) * 45 // spread across the last several hours
    const solveDurationMinutes = (i % 5) + 1 // cycles 1–5 minutes to solve

    const start = new Date(now - 1000 * 60 * minutesAgoStarted)
    const end = new Date(start.getTime() + 1000 * 60 * solveDurationMinutes)

    rows.push({
      word_id: word.id,
      user_id: user.id,
      time_start: start,
      time_end: end,
    })
  }

  await knex('games').insert(rows)
}
