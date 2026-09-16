import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { getLeaderboard, getMyRank } from '../apis/leaderboard.ts'

// The public fastest-wins board. Works logged out.
// queryKey includes the limit so different sizes cache separately.
export function useLeaderboard(limit = 10) {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: () => getLeaderboard(limit),
  })
}

// The logged-in user's best entry + global rank.
// Skipped entirely until authenticated (mirrors useGameStats).
export function useMyRank() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useQuery({
    queryKey: ['leaderboard-me'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getMyRank(token)
    },
    enabled: isAuthenticated,
  })
}
