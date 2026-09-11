
import { useMutation } from '@tanstack/react-query'
import { revealWord } from '../apis/words.ts'

// This hook calls revealWord() & tracks the loading states 
// It is triggered when a user clicks the "Give Up" button
export function useGiveUp() {
  const mutation = useMutation({
      mutationFn: revealWord,
    })
  return {...mutation,}
}

