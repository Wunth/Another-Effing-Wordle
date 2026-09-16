export interface Word {
  id: number
  word: string
}

export interface RandomWord {
  id: number
  length: number
}

export type LetterResult = 'correct' | 'present' | 'absent'

export interface CheckGuessResult {
  result: LetterResult[]
  message?: string
  gameId?: number
}
