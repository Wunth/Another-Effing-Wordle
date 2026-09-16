// Leaderboard routes — see docs/leaderboard-spec.md
import { Router } from 'express'
import {
  getLeaderboard,
  getTotalPlayers,
  getMyLeaderboardEntry,
} from '../db/leaderboard.ts'
import checkJwt, { JwtRequest } from '../auth.ts'

const router = Router()

const DEFAULT_LIMIT = 100
const MAX_LIMIT = 100

// GET /?limit=10 — public board of the fastest wins
router.get('/', async (req, res) => {
  try {
    const parsed = Number(req.query.limit)
    const limit = Number.isFinite(parsed) && parsed > 0
      ? Math.min(Math.floor(parsed), MAX_LIMIT)
      : DEFAULT_LIMIT

    const [entries, totalPlayers] = await Promise.all([
      getLeaderboard(limit),
      getTotalPlayers(),
    ])

    res.json({ entries, totalPlayers })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// GET /me — the caller's best entry and global rank (login required)
router.get('/me', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    if (!auth0Id) {
      return res.status(401).json({ message: 'Login required' })
    }

    const me = await getMyLeaderboardEntry(auth0Id)
    res.json({ rank: me ? me.rank : null, best: me ? me.best : null })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
