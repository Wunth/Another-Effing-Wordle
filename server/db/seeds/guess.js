export async function seed(knex) {
  await knex('guess').del()

  const games = await knex('games').where({ user_id: 1 }).orderBy('time_start')

  if (games.length === 0) {
    console.log('No games found for user 1 — run games.js seed first.')
    return
  }

  const words = await knex('words').select('id', 'word')
  function wordFor(wordId) {
    return words.find((w) => w.id === wordId)?.word
  }

  function wrongGuess(letter, length) {
    return letter.repeat(length)
  }

  // A small pool of filler letters so multiple wrong guesses in the same
  // game don't all look identical
  const fillerLetters = ['z', 'q', 'x', 'j', 'v']

  const rows = []

  games.forEach((game, gameIndex) => {
    const correctWord = wordFor(game.word_id)
    if (!correctWord) return

    const start = new Date(game.time_start).getTime()
    const end = new Date(game.time_end).getTime()

    // vary the number of wrong guesses per game (0 to 4), so total guesses
    // per game ranges from 1 (first try) to 5
    const wrongGuessCount = gameIndex % 5
    const wrongGuesses = Array.from({ length: wrongGuessCount }, (_, i) =>
      wrongGuess(fillerLetters[i % fillerLetters.length], correctWord.length),
    )

    const step = (end - start) / (wrongGuesses.length + 1)

    wrongGuesses.forEach((guessText, i) => {
      rows.push({
        games_id: game.id,
        guess: guessText,
        time_submitted: new Date(start + step * (i + 1)),
      })
    })

    // final, correct guess — exactly at time_end
    rows.push({
      games_id: game.id,
      guess: correctWord,
      time_submitted: game.time_end,
    })
  })

  await knex('guess').insert(rows)
}
