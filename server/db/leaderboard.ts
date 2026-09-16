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

// Timestamps in this DB come in mixed formats: the app inserts ISO
// strings (JSON body) while seeds insert JS Dates, which the sqlite3
// driver stores as integer epoch-ms. SQLite's strftime() returns NULL
// for integers, so duration is computed in JS where new Date() can
// parse both formats.
function durationSeconds(timeStart: unknown, timeEnd: unknown): number {
  const start = new Date(timeStart as string | number).getTime()
  const end = new Date(timeEnd as string | number).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return 0
  return Math.round((end - start) / 1000)
}

// Shared filters: rows with both timestamps present.
function baseQuery(db = connection) {
  return db('games')
    .join('users', 'games.user_id', 'users.id')
    .join('words', 'games.word_id', 'words.id')
    .whereNotNull('games.time_start')
    .whereNotNull('games.time_end')
}

// Fetch joined rows, compute durations, drop non-positive ones, and
// sort fastest-first with ties broken by earlier completion.
async function rankedRows(db = connection) {
  const rows = await baseQuery(db).select(
    'users.id as userId',
    'users.name as playerName',
    'words.word as word',
    'games.time_start as startedAt',
    'games.time_end as completedAt',
  )

  return rows
    .map((row) => ({
      ...row,
      durationSeconds: durationSeconds(row.startedAt, row.completedAt),
    }))
    .filter((row) => row.durationSeconds > 0)
    .sort(
      (a, b) =>
        a.durationSeconds - b.durationSeconds ||
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
    )
}

// Top `limit` fastest wins, ranked by position in the result.
export async function getLeaderboard(
  limit: number,
  db = connection,
): Promise<LeaderboardRow[]> {
  const rows = await rankedRows(db)
  return rows
    .slice(0, limit)
    .map(({ startedAt, ...row }, i) => ({ ...row, rank: i + 1 })) as LeaderboardRow[]
}

// Distinct players who have at least one rankable game.
export async function getTotalPlayers(db = connection): Promise<number> {
  const rows = await rankedRows(db)
  return new Set(rows.map((row) => row.userId)).size
}

// The caller's best (fastest) entry plus its rank on the global board.
// Returns null when the user has no rankable games.
export async function getMyLeaderboardEntry(auth0Id: string, db = connection) {
  const user = await db('users').where({ auth0_id: auth0Id }).first()
  if (!user) return null

  // Rank against the full ordered board. Fine at this app's scale; if
  // the board ever gets big, replace with a window function.
  const board = await rankedRows(db)
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
