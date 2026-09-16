// Leaderboard — presentational component for fastest-win rankings.
// Give it entries and it sorts by time (fastest first) and assigns ranks.
// Wire it up like:
//   const { data } = useLeaderboard()          // your fetch hook
//   <Leaderboard entries={data.entries} currentUserId={user?.id} />

export interface LeaderboardEntry {
  userId: number
  playerName: string
  word: string
  /** Solve time in whole seconds (time_end - time_start). */
  durationSeconds: number
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  /** Highlights this user's rows (from your auth state). Optional. */
  currentUserId?: number | null
  /** Only show the top N rows after sorting. Shows all if omitted. */
  limit?: number
}

// Formats seconds as m:ss — 42 -> "0:42", 83 -> "1:23"
function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function Leaderboard({ entries, currentUserId, limit }: LeaderboardProps) {
  // Sort fastest-first, then cap to the limit, then number the ranks.
  // Ranks are derived from position, never passed in, so they can't drift
  // out of sync with the ordering.
  const ranked = [...entries]
    .sort((a, b) => a.durationSeconds - b.durationSeconds)
    .slice(0, limit ?? entries.length)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))

  if (ranked.length === 0) {
    return (
      <p className="text-center text-gray-400 italic" style={{ fontFamily: 'Fredoka, sans-serif' }}>
        No wins recorded yet. Go set the bar.
      </p>
    )
  }

  return (
    <table className="w-full max-w-2xl border-collapse text-left">
      <thead>
        <tr className="border-b-2 border-yellow-400 text-yellow-400">
          <th className="px-4 py-2 text-lg" style={{ fontFamily: 'Bungee, cursive' }}>
            Rank
          </th>
          <th className="px-4 py-2 text-lg" style={{ fontFamily: 'Bungee, cursive' }}>
            User
          </th>
          <th className="px-4 py-2 text-lg" style={{ fontFamily: 'Bungee, cursive' }}>
            Word
          </th>
          <th className="px-4 py-2 text-lg" style={{ fontFamily: 'Bungee, cursive' }}>
            Time
          </th>
        </tr>
      </thead>
      <tbody>
        {ranked.map((entry) => {
          const isMe =
            currentUserId != null && entry.userId === currentUserId
          return (
            <tr
              key={`${entry.userId}-${entry.word}-${entry.durationSeconds}`}
              className={`border-b border-gray-700 text-white ${
                isMe ? 'bg-yellow-400/20' : ''
              }`}
            >
              <td className="px-4 py-2 font-bold">{entry.rank}</td>
              <td className="px-4 py-2">
                {entry.playerName}
                {isMe && (
                  <span className="ml-2 text-xs text-yellow-400">(you)</span>
                )}
              </td>
              <td className="px-4 py-2 italic">{entry.word}</td>
              <td className="px-4 py-2 font-mono">{formatTime(entry.durationSeconds)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Leaderboard
