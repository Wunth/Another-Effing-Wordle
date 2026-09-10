import { useMutation } from '@tanstack/react-query'
import { getRandomWord } from '../apis/words.ts'

// This hook calls getRandomWord() & tracks the loading states 
// It is triggered when a user clicks the "New Game" button / when they want a new random word
export function useNewGame() {
  const mutation = useMutation({
      mutationFn: getRandomWord,
    })
  return {...mutation,}
}

