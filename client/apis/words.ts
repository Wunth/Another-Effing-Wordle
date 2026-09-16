import request from 'superagent'
import { RandomWord, Word, CheckGuessResult } from '../../models/word'

const rootURL = new URL(`/api/v1`, document.baseURI)

// function calling the backend/server to get one random word
export async function getRandomWord(): Promise<RandomWord> {
  const response = await request.get(`${rootURL}/words/random`)
  return response.body as RandomWord
}

// function calling the backend/server to get a word by its id
// used when the player clicks give up & needs to see what the word is
export async function revealWord(id: number): Promise<Word | string> {
  const response = await request.get(`${rootURL}/words/${id}/reveal`)
  return response.body.word
}

// function calling the backend/server to check a guess against the correct word
// gameId/startTime/token are only meaningful for logged-in players — the server
// ignores them (and records nothing) for guests, where gameId is undefined
export async function checkGuess(
  {
    wordId,
    guess,
    gameId,
    startTime,
  }: {
    wordId: number
    guess: string
    gameId?: number
    startTime?: Date
  },
  token?: string,
): Promise<CheckGuessResult> {
  const req = request
    .post(`${rootURL}/words/check`)
    .send({ wordId, guess, gameId, startTime })

  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }

  const response = await req
  return response.body as CheckGuessResult
}
