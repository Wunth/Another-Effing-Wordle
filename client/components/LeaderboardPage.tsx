// Leaderboard page — wraps the presentational Leaderboard table with
// data fetching. Route: /leaderboard (public — viewable logged out).
import { Link } from 'react-router'
import Leaderboard from './Leaderboard.tsx'
import { useLeaderboard, useMyRank } from '../hooks/useLeaderboard.ts'

function LeaderboardPage() {
  const { data, isPending, isError } = useLeaderboard(100)
  const { data: me } = useMyRank()

  if (isPending) return <p>Loading...</p>
  if (isError) return <p>Could not load leaderboard</p>

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1
        className="text-6xl text-yellow-400"
        style={{ fontFamily: 'Bungee, cursive' }}
      >
        Leaderboard
      </h1>
      {me?.best && (
        <p className="text-gray-300">
          Your best: rank #{me.rank} — {me.best.word} in{' '}
          {me.best.durationSeconds}s
        </p>
      )}
      <Leaderboard entries={data.entries} />
      <Link
        to="/"
        className="rounded-lg bg-blue-500 px-6 py-3 text-lg uppercase text-white hover:bg-blue-600"
        style={{ fontFamily: 'Bungee, cursive' }}
      >
        Back to Game
      </Link>
      <p></p>
    </main>
  )
}

export default LeaderboardPage
