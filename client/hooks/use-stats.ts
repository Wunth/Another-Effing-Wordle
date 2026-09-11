import { useState, useEffect } from 'react'

const STORAGE_KEY = 'afw-stats'

type Stats = {
  gamesPlayed: number
  wins: number
  totalGuesses: number
}

// Starting point for a brand-new player
const defaultStats: Stats = {
  gamesPlayed: 0,
  wins: 0,
  totalGuesses: 0,
}

// Reads stats from localStorage, falling back to defaults if missing or corrupted
function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStats

    const parsed = JSON.parse(raw)
    if (
      typeof parsed.gamesPlayed !== 'number' ||
      typeof parsed.wins !== 'number' ||
      typeof parsed.totalGuesses !== 'number'
    ) {
      return defaultStats
    }
    return parsed
  } catch {
    return defaultStats
  }
}

// Tracks games played, wins, and average guesses to solve — persisted in localStorage
export function useStats() {
  const [stats, setStats] = useState<Stats>(loadStats)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  }, [stats])

  // Call this once a round ends
  function recordRound({ won, guesses }: { won: boolean; guesses: number }) {
    setStats((prev) => ({
      gamesPlayed: prev.gamesPlayed + 1,
      wins: won ? prev.wins + 1 : prev.wins,
      totalGuesses: won ? prev.totalGuesses + guesses : prev.totalGuesses,
    }))
  }

  const averageGuesses = stats.wins > 0 ? stats.totalGuesses / stats.wins : 0

  return {
    gamesPlayed: stats.gamesPlayed,
    wins: stats.wins,
    averageGuesses,
    recordRound,
  }
}

export default useStats
