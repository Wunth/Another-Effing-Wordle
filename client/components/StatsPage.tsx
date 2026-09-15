import { Link } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useGameStats } from '../hooks/useGameStats.ts'

function StatsPage() {
  const { isAuthenticated } = useAuth0()
  const { data, isPending, isError } = useGameStats()

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <h1 className="text-6xl font-bold text-yellow-400">Your Stats</h1>
        <p className="text-xl text-gray-400">Log in to track your stats.</p>
        <Link
          to="/"
          className="rounded-lg bg-blue-500 px-6 py-3 text-lg uppercase text-white hover:bg-blue-600"
          style={{ fontFamily: 'Bungee, cursive' }}
        >
          Back to Game
        </Link>
      </div>
    )
  }

  if (isPending) return <p>Loading...</p>
  if (isError) return <p>Could not load stats</p>

  const gamesPlayed = data.gamesPlayed
  const wins = data.gamesPlayed
  const averageGuesses = data.averageGuesses

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12">
      <h1 className="text-6xl font-bold text-yellow-400">Your Stats</h1>
      <div className="flex flex-row gap-24 text-center">
        <div className="flex flex-col">
          <span className="text-8xl font-bold text-white">{gamesPlayed}</span>
          <span className="text-xl text-gray-400">Played</span>
        </div>
        <div className="flex flex-col">
          <span className="text-8xl font-bold text-white">{wins}</span>
          <span className="text-xl text-gray-400">Wins</span>
        </div>
        <div className="flex flex-col">
          <span className="text-8xl font-bold text-white">
            {averageGuesses.toFixed(1)}
          </span>
          <span className="text-xl text-gray-400">Avg Guesses</span>
        </div>
      </div>

      <Link
        to="/"
        className="rounded-lg bg-blue-500 px-6 py-3 text-lg uppercase text-white hover:bg-blue-600"
        style={{ fontFamily: 'Bungee, cursive' }}
      >
        Back to Game
      </Link>
    </main>
  )
}

export default StatsPage
