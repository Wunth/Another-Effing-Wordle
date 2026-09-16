import connection from './connection.ts'

export async function createGuess(
  {
    gamesId,
    guess,
    timeSubmitted,
  }: {
    gamesId: number
    guess: string
    timeSubmitted: Date
  },
  db = connection,
) {
  const [row] = await db('guess')
    .insert({
      games_id: gamesId,
      guess,
      time_submitted: timeSubmitted,
    })
    .returning('*')
  return row
}
