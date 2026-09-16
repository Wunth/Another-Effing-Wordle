import { useMutation } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { checkGuess } from '../apis/words.ts'

export function useCheckGuess() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  const mutation = useMutation({
    mutationFn: async ({
      wordId,
      guess,
      gameId,
      startTime,
      email,
    }: {
      wordId: number
      guess: string
      gameId?: number
      startTime?: Date
      email?: string
    }) => {
      const token = isAuthenticated ? await getAccessTokenSilently() : undefined
      return checkGuess({ wordId, guess, gameId, startTime, email }, token)
    },
  })
  return { ...mutation }
}
