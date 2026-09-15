import request from 'superagent'
import { GameStats } from '../../models/game.ts'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function submitGame(
  {
    wordId,
    startTime,
    endTime,
  }: { wordId: number; startTime: Date; endTime: Date },
  token: string,
): Promise<void> {
  await request
    .post(`${rootURL}/words/games`)
    .set('Authorization', `Bearer ${token}`)
    .send({ wordId, startTime, endTime })
}

export async function getStats(token: string): Promise<GameStats> {
  const response = await request
    .get(`${rootURL}/words/stats`)
    .set('Authorization', `Bearer ${token}`)
  return response.body as GameStats
}
