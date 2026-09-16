import { useMutation } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { setUsername } from '../apis/users.ts'

export function useSetUsername() {
  const { getAccessTokenSilently } = useAuth0()

  const mutation = useMutation({
    mutationFn: async (username: string) => {
      const token = await getAccessTokenSilently()
      return setUsername(username, token)
    },
  })
  return { ...mutation }
}
