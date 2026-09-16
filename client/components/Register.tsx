import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { useSetUsername } from '../hooks/useSetUsername.ts'
import { useMe } from '../hooks/useMe.ts'
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated.tsx'

function Register() {
  const [username, setUsernameInput] = useState('')
  const [prefilledName, setPrefilledName] = useState<string | null | undefined>(
    undefined,
  )
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const { mutate, isPending } = useSetUsername()
  const { data: me } = useMe()
  const queryClient = useQueryClient()

  // Pre-fill with the existing name once it loads, but only the first time
  // it changes — not on every render. This runs during render itself rather
  // than in an effect, per React's guidance for "adjusting state when a
  // value from props/queries changes."
  if (me?.name !== prefilledName) {
    setPrefilledName(me?.name)
    if (me?.name && username === '') {
      setUsernameInput(me.name)
    }
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(evt.target.value)
    setSuccessMsg('')
  }

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setErrorMsg('')
    mutate(username, {
      onSuccess: () => {
        setSuccessMsg('Username saved!')
        queryClient.invalidateQueries({ queryKey: ['me'] })
      },
      onError: (error: unknown) => {
        setErrorMsg(error instanceof Error ? error.message : 'Unknown error')
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-6xl font-bold text-yellow-400">Set Your Username</h1>

      <IfAuthenticated>
        {errorMsg && (
          <div className="text-red-500">
            Error: {errorMsg}
            <button onClick={() => setErrorMsg('')}>Okay</button>
          </div>
        )}
        {successMsg && <div className="text-green-500">{successMsg}</div>}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <div>
            <label htmlFor="username" className="text-gray-300">
              Username:&nbsp;{' '}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              maxLength={20}
              className="rounded-lg border-2 border-yellow-400 bg-gray-800 px-4 py-2 text-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
              placeholder="Enter a username"
            />
          </div>
          <button
            disabled={!username.trim() || isPending}
            className="rounded-lg bg-blue-500 px-6 py-3 text-lg uppercase text-white hover:bg-blue-600 disabled:opacity-50"
            style={{ fontFamily: 'Bungee, cursive' }}
          >
            {isPending ? 'Saving...' : 'Save Username'}
          </button>
        </form>
      </IfAuthenticated>

      <IfNotAuthenticated>
        <p className="setusername text-xl text-gray-400">
          Must be logged in to set a username.
        </p>
      </IfNotAuthenticated>

      <Link
        to="/"
        className="rounded-lg bg-blue-500 px-6 py-3 text-lg uppercase text-white hover:bg-blue-600"
        style={{ fontFamily: 'Bungee, cursive' }}
      >
        Back to Game
      </Link>
    </div>
  )
}

export default Register
