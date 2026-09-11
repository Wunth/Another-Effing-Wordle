import { useMutation } from '@tanstack/react-query'
import { checkGuess } from '../apis/words.ts'

// This hook calls checkGuess() & tracks the loading states
// It is triggered when the user presses Enter to submit their guess
export function useCheckGuess() {
  const mutation = useMutation({
    mutationFn: ({ wordId, guess }: { wordId: number; guess: string }) =>
      checkGuess(wordId, guess),
  })
  return { ...mutation }
}
