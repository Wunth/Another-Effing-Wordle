import { expressjwt as jwt, GetVerificationKey } from 'express-jwt'
import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'
import jwks from 'jwks-rsa'

const domain = 'https://hotoke-2026-graham.au.auth0.com'
const audience = 'https://afw/api'

const jwtSecret = jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `${domain}/.well-known/jwks.json`,
}) as GetVerificationKey

const checkJwt = jwt({
  secret: jwtSecret,
  audience: audience,
  issuer: `${domain}/`,
  algorithms: ['RS256'],
})

// Verifies the token if one is present, but doesn't reject the request if
// there isn't one — for routes that should work for both guests and
// logged-in users (e.g. saving stats only when logged in).
const optionalCheckJwt = jwt({
  secret: jwtSecret,
  audience: audience,
  issuer: `${domain}/`,
  algorithms: ['RS256'],
  credentialsRequired: false,
})

export default checkJwt
export { optionalCheckJwt }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface JwtRequest<TReq = any, TRes = any> extends Request<
  ParamsDictionary,
  TRes,
  TReq
> {
  auth?: JwtPayload
}
