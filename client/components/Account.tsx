import { IfAuthenticated, IfNotAuthenticated } from './Authenticated.tsx'
import { useAuth0 } from '@auth0/auth0-react'

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
        <button className="btn_account sign_out" onClick={handleSignOut}>
          Sign out
        </button>
        {user && <p>Signed in as: {user?.email}</p>}
      </IfAuthenticated>
      <IfNotAuthenticated>
        <button className="btn_account sign_in" onClick={handleSignIn}>
          Sign in
        </button>
      </IfNotAuthenticated>
    </>
  )
}

export default Account
