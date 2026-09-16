import { useMutation } from '@tanstack/react-query'
import { checkGuess } from '../apis/words.ts'
import { useAuth0 } from '@auth0/auth0-react'

// This hook calls checkGuess() & tracks the loading states
// It is triggered when the user presses Enter to submit their guess
export function useCheckGuess() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  const mutation = useMutation({
    mutationFn: async ({
      wordId,
      guess,
      gameId,
      startTime,
    }: {
      wordId: number
      guess: string
      gameId?: number
      startTime?: Date
    }) => {
      // guests never fetch a token — same as the old behavior, just explicit now
      const token = isAuthenticated ? await getAccessTokenSilently() : undefined
      return checkGuess({ wordId, guess, gameId, startTime }, token)
    },
  })
  return { ...mutation }
}
