import { useStats } from '../hooks/use-stats'

export function StatsPanel() {
  // Fetch stats from the custom hook
  const { gamesPlayed, wins, averageGuesses } = useStats()

  // If no games have been played yet, show the empty state message
  if (gamesPlayed === 0) {
    return (
      <div className="afw-stats-empty">No rounds played yet. Take a guess!</div>
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
