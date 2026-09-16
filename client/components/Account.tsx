import { IfAuthenticated, IfNotAuthenticated } from './Authenticated.tsx'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router'

function Account() {
  const { logout, loginWithRedirect, user } = useAuth0()
  console.log('Auth0 user:', user)

  const handleSignOut = () => {
    logout()
  }

  const handleSignIn = () => {
    console.log('sign in')
    loginWithRedirect()
  }

  return (
    <>
      <IfAuthenticated>
        {user && (
          <p>
            Signed in <br />
            {user?.email}
          </p>
        )}
        <Link
          to="/stats"
          className="w-41 rounded-lg bg-blue-500 px-6 py-3 text-lg uppercase text-white hover:bg-blue-600"
          style={{ fontFamily: 'Bungee, cursive' }}
        >
          View Stats
        </Link>
        <button className="btn_account sign_out" onClick={handleSignOut}>
          Sign out
        </button>
      </IfAuthenticated>
      <IfNotAuthenticated>
        <p>Sign in to log games and view stats</p>
        <button
          className="btn_account sign_in w-41 rounded-lg bg-blue-500 px-6 py-3 text-lg uppercase text-white hover:bg-blue-600"
          onClick={handleSignIn}
          style={{ fontFamily: 'Bungee, cursive' }}
        >
          Sign in
        </button>
      </IfNotAuthenticated>
    </>
  )
}

export default Account
