// This file has the route that fetches a random word from the db

import { Router } from 'express'

import * as db from '../db/words.ts'

const router = Router()

// When the user makes a GET request to /random, run this function
router.get('/random', async (req, res) => {
  try {
    // call the db function to get a random word and wait
    const word = await db.getRandomWord()

    // if no word came back or the table is empty, inform the frontend and stop 
    if (!word) {
      return res.status(500).json({message: 'No words found in the database'})
    }

    // send the random word back to whoever made the request as JSON
    res.json({ word })

    // if it fails or crashes, show an error message
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
