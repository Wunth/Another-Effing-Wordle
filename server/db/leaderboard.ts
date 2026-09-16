// Leaderboard queries: fastest wins across all players.
// See docs/leaderboard-spec.md for the shape and rules.
import connection from './connection.ts'

export interface LeaderboardRow {
  userId: number
  playerName: string
  word: string
  durationSeconds: number
  completedAt: string
  rank: number
}

// Duration in whole seconds. Kept in one expression so a future
// Postgres move only has to change this (EXTRACT(EPOCH FROM ...)).
const durationSql = `CAST(strftime('%s', games.time_end) AS INTEGER)
  - CAST(strftime('%s', games.time_start) AS INTEGER)`

// Shared filters so the board and the /me rank use identical
// rankability rules (timestamps present, positive duration).
function baseQuery(db = connection) {
  return db('games')
    .join('users', 'games.user_id', 'users.id')
    .join('words', 'games.word_id', 'words.id')
    .whereNotNull('games.time_start')
    .whereNotNull('games.time_end')
    .whereRaw(`${durationSql} > 0`)
}

// Top `limit` fastest wins, ranked by position in the result.
export async function getLeaderboard(
  limit: number,
  db = connection,
): Promise<LeaderboardRow[]> {
  const rows: LeaderboardRow[] = await baseQuery(db)
    .select(
      'users.id as userId',
      'users.name as playerName',
      'words.word as word',
      'games.time_end as completedAt',
      db.raw(`${durationSql} as durationSeconds`),
    )
    .orderBy('durationSeconds', 'asc')
    .orderBy('games.time_end', 'asc')
    .limit(limit)
  return rows.map((row, i) => ({ ...row, rank: i + 1 }))
}

// Distinct players who have at least one rankable game.
export async function getTotalPlayers(db = connection): Promise<number> {
  const [result] = await baseQuery(db).countDistinct({
    count: 'games.user_id',
  })
  return Number(result.count)
}

// The caller's best (fastest) entry plus its rank on the global board.
// Returns null when the user has no rankable games.
export async function getMyLeaderboardEntry(auth0Id: string, db = connection) {
  const user = await db('users').where({ auth0_id: auth0Id }).first()
  if (!user) return null

  // Rank against the full ordered board. Fine at this app's scale; if
  // the board ever gets big, replace with a window function.
  const board: LeaderboardRow[] = await baseQuery(db)
    .select(
      'users.id as userId',
      'words.word as word',
      'games.time_end as completedAt',
      db.raw(`${durationSql} as durationSeconds`),
    )
    .orderBy('durationSeconds', 'asc')
    .orderBy('games.time_end', 'asc')

  const myIndex = board.findIndex((row) => row.userId === user.id)
  if (myIndex === -1) return null

  const best = board[myIndex]
  return {
    rank: myIndex + 1,
    best: {
      word: best.word,
      durationSeconds: best.durationSeconds,
      completedAt: best.completedAt,
    },
  }
}
