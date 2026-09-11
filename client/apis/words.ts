import request from 'superagent'
import { RandomWord } from '../../models/word'

// builds the base address for every API call
const rootURL = new URL(`/api/v1`, document.baseURI)

// function calling the backend/server to get one random word
export async function getRandomWord(): Promise<RandomWord> {
  // send a GET request to /api/v1/words/random and wait for the server to respond
  const response = await request.get(`${rootURL}/words/random`)
  // backend sends a JSON shaped response containing lots of information
  // backend sends { id: word.id, length: word.word.length } (matches RandomWord)
  // only grab the one random word from the object
  return response.body as RandomWord
}
