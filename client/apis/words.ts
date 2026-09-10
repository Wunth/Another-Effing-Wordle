import request from 'superagent'
import { Word } from '../../models/word.ts'

// builds the base address for every API call
const rootURL = new URL(`/api/v1`, document.baseURI)

// function calling the backend/server to get one random word
export async function getRandomWord(): Promise<Word> {
  // send a GET request to /api/v1/words/random and wait for the server to respond
  const response = await request.get(`${rootURL}/words/random`)
  // backend sends a JSON shaped response containing lots of information
  // only grab the one random word from the object
  return response.body.word as Word
}

// function calling the backend/server to get a word by its id
// used when the player clicks give up & needs to see what the word is
export async function revealWord(id: number): Promise<Word | string> {
  // send a GET request to /api/v1/words/:id/reveal & wait for the server to respond
  const response = await request.get(`${rootURL}/words/${id}/reveal`)
  return response.body.word
}
