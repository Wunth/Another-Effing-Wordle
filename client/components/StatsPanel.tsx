import { useStats } from '../hooks/use-stats'

// guessCount tells us if the player has made a guess in the current round
export function StatsPanel({ guessCount }: { guessCount: number }) {
  // Fetch stats from the custom hook
  const { gamesPlayed, wins, averageGuesses } = useStats()

  // Show the message whenever the current round has no guesses yet —
  // regardless of how many games have been played before
  if (guessCount === 0) {
    return (
      <div
        className="afw-stats-empty italic"
        style={{ fontFamily: 'Bungee, cursive' }}
      >
        Too much silence, not enough guessing.
      </div>
    )
  }

  // Otherwise, render the stats cards directly without a helper component
  return (
    <div className="afw-stats-display">
      <div className="afw-stat-card">
        <span className="afw-stat-value">{gamesPlayed}</span>
        <span className="afw-stat-label">Played</span>
      </div>
      <div className="afw-stat-card">
        <span className="afw-stat-value">{wins}</span>
        <span className="afw-stat-label">Wins</span>
      </div>
      <div className="afw-stat-card">
        <span className="afw-stat-value">{averageGuesses}</span>
        <span className="afw-stat-label">Avg Guesses</span>
      </div>
    </div>
  )
}
