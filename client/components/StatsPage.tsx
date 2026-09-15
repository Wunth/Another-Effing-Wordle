import { Link } from 'react-router'
import { useStats } from '../hooks/use-stats.ts'

// A dedicated page for viewing personal stats, reached via /stats
function StatsPage() {
  const { gamesPlayed, wins, averageGuesses } = useStats()

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
            {averageGuesses}
          </span>
          <span className="text-xl text-gray-400">Avg Guesses</span>
        </div>
      </div>

      <Link
        to="/"
        className="rounded-lg bg-blue-500 px-6 py-3 text-lg font-bold uppercase text-white hover:bg-blue-600"
        style={{ fontFamily: 'Bungee, cursive' }}
      >
        Back to Game
      </Link>
    </main>
  )
}

export default StatsPage
