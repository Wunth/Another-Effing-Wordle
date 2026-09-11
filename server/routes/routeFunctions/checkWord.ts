import type { LetterResult } from '../../../models/word.ts'

export function checkWord(correctWord: string, guess: string): LetterResult[] {
  try {
    const guessArray = guess.split('')
    const correctWordArray = correctWord.split('')
    const result: LetterResult[] = guessArray.map((letter, index) => {
      if (letter === correctWordArray?.[index]) {
        return 'correct'
      } else if (correctWordArray?.includes(letter)) {
        return 'present'
      } else {
        return 'absent'
      }
    })
    return result
  } catch (error) {
    console.log(error)
    console.error('Error checking word:', error)
    throw new Error('Error checking word')
  }
}
