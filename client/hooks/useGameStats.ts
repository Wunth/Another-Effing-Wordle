import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { getStats } from '../apis/games.ts'

export function useGameStats() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getStats(token)
    },
    enabled: isAuthenticated, // don't attempt the request if not logged in
  })
}
