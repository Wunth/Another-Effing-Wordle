import connection from './connection.ts'

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
