import request from 'superagent'
import { RandomWord, Word } from '../../models/word'

// builds the base address for every API call
const rootURL = new URL(`/api/v1`, document.baseURI)

// function calling the backend/server to get one random word
export async function getRandomWord(): Promise<RandomWord> {
  // send a GET request to /api/v1/words/random and wait for the server to respond
  const response = await request.get(`${rootURL}/words/random`)
  // backend sends a JSON shaped response object
  return response.body as RandomWord
}

// function calling the backend/server to get a word by its id
// used when the player clicks give up & needs to see what the word is
export async function revealWord(id: number): Promise<Word | string> {
  // send a GET request to /api/v1/words/:id/reveal & wait for the server to respond
  const response = await request.get(`${rootURL}/words/${id}/reveal`)
  return response.body.word
}