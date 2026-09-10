// This file has the route that fetches a random word from the db

import { Router } from 'express'

import * as db from '../db/words.ts'

const router = Router()

// When the user makes a GET request to /random, run this function
router.get('/random', async (req, res) => {
  try {
    // call the db function to get a random word and wait
    const word = await db.getRandomWord()

    // if no word came back or the table is empty
    // send 404 error (not 500 as it is not a server error)
    if (!word) {
      return res.status(404).json({message: 'No words found in the database'})
    }

    // send id + length to the frontend (not the actual word)
    res.json({ id: word.id, length: word.word.length })

    // if it fails or crashes, show an error message
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
