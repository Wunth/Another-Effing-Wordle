import connection from './connection.ts'
/*
export async function createGameRecord(
  {
    wordId,
    userId,
    startTime,
    endTime,
  }: {
    wordId: number
    userId: number
    startTime: Date
    endTime: Date
  },
  db = connection,
) {
  const [game] = await db('games')
    .insert({
      word_id: wordId,
      user_id: userId,
      time_start: startTime,
      time_end: endTime,
    })
    .returning('*')
  return game
}
*/
export async function getGamesByUserId(userId: number, db = connection) {
  return db('games').where({ user_id: userId }).orderBy('time_start', 'desc')
}

export async function getAverageGuessesForUser(
  userId: number,
  db = connection,
) {
  const games = await db('games').where({ user_id: userId }).select('id')
  const gameIds = games.map((g) => g.id)

  if (gameIds.length === 0) return 0

  const guessCounts = await db('guess')
    .whereIn('games_id', gameIds)
    .groupBy('games_id')
    .count('id as count')

  const totalGuesses = guessCounts.reduce(
    (sum, row) => sum + Number(row.count),
    0,
  )
  return totalGuesses / gameIds.length
}

export async function startGameRecord(
  {
    wordId,
    userId,
    startTime,
  }: {
    wordId: number
    userId: number
    startTime: Date
  },
  db = connection,
) {
  const [game] = await db('games')
    .insert({
      word_id: wordId,
      user_id: userId,
      time_start: startTime,
      time_end: null,
    })
    .returning('*')
  return game
}

export async function setGameEndTime(
  gameId: number,
  endTime: Date,
  db = connection,
) {
  const [game] = await db('games')
    .where({ id: gameId })
    .update({ time_end: endTime })
    .returning('*')
  return game
}
