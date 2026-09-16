import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { getMe } from '../apis/users.ts'

export function useMe() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getMe(token)
    },
    enabled: isAuthenticated,
  })
}
