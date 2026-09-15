import { useAuth0 } from '@auth0/auth0-react'
import { endGame } from '../apis/words.ts'

// Ends a game server-side, but only if the player is actually logged in —
// guests never get a gameId back from /random, so there's nothing to end.
export function useEndGame() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  async function closeGame(gameId: number | null) {
    if (gameId === null || !isAuthenticated) return

    const token = await getAccessTokenSilently()
    await endGame(gameId, token)
  }

  return { closeGame }
}
