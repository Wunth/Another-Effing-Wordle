import request from 'superagent'

export interface LeaderboardEntry {
  rank: number
  userId: number
  playerName: string
  word: string
  durationSeconds: number
  completedAt: string
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[]
  totalPlayers: number
}

export interface MyRankResponse {
  rank: number | null
  best: {
    word: string
    durationSeconds: number
    completedAt: string
  } | null
}

const rootURL = new URL(`/api/v1`, document.baseURI)

// Fetch the top `limit` fastest wins (public — no token needed)
export async function getLeaderboard(limit = 10): Promise<LeaderboardResponse> {
  const response = await request.get(`${rootURL}/leaderboard?limit=${limit}`)
  return response.body as LeaderboardResponse
}

// Fetch the current user's best entry + global rank (token required)
export async function getMyRank(token: string): Promise<MyRankResponse> {
  const response = await request
    .get(`${rootURL}/leaderboard/me`)
    .set('Authorization', `Bearer ${token}`)
  return response.body as MyRankResponse
}
