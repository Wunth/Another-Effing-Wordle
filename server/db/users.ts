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

// Sets a user's display name. If the user already has a row (e.g. auto-created
// as a placeholder by /check on their first guess), updates it in place rather
// than inserting a duplicate. If they somehow don't have a row yet, creates one.
export async function setUsername(
  { auth0Id, name }: { auth0Id: string; name: string },
  db = connection,
) {
  const existing = await getUserByAuth0Id(auth0Id, db)
  if (existing) {
    const [user] = await db('users')
      .where({ auth0_id: auth0Id })
      .update({ name })
      .returning('*')
    return user
  }
  return addUser({ auth0_id: auth0Id, name }, db)
}
