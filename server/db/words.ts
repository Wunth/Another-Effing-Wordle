import connection from './connection.ts'
import { Word } from '../../models/word.ts'

// This function goes to the db and grabs a random word
export async function getRandomWord(db = connection): Promise<Word | undefined >{
  // go to the words table
  const word = await db('words')
    // Put all the rows in a random order
    .orderByRaw('RANDOM()')
    // then select and send back the first one
    .first()
  return word
}

// This function goes to the db and grabs one specific word by its id
// Once a round has ended and the player needs to see the answer
export async function getWordById(
  id: number,
  db = connection,
): Promise<Word | undefined> {
  const word = await db('words').where('id', id).first()
  return word
}
