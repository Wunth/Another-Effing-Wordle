import connection from './connection.ts'

export async function getUserByAuth0Id(auth0Id: string, db = connection) {
  return db('users').where({ auth0_id: auth0Id }).first()
}

export async function addUser(
  newUser: { auth0_id: string; name: string },
  db = connection,
) {
  const [user] = await db('users').insert(newUser).returning('*')
  return user
}
