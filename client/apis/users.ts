import request from 'superagent'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function setUsername(
  username: string,
  token: string,
): Promise<{ id: number; name: string; auth0_id: string }> {
  const response = await request
    .patch(`${rootURL}/words/users/me`)
    .set('Authorization', `Bearer ${token}`)
    .send({ username })
  return response.body
}

// get their display name
export async function getMe(token: string): Promise<{ name: string | null }> {
  const response = await request
    .get(`${rootURL}/words/users/me`)
    .set('Authorization', `Bearer ${token}`)
  return response.body
}
