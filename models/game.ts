export interface GameStats {
  gamesPlayed: number
  games: {
    id: number
    word_id: number
    user_id: number
    time_start: string
    time_end: string | null
  }[]
  averageGuesses: number
}
