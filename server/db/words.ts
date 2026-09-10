import connection from './connection.ts'
import { Word } from '../../models/word.ts'

// This function goes to the db and grabs a random word
export async function getRandomWord(db = connection): Promise<Word> {
  // go to the words table
  const word = await db('words')
    // Put all the rows in a random order
    .orderByRaw('RANDOM()')
    // then select and send back the first one
    .first()
  return word
}
