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
      return res.status(500).json({ message: 'No words found in the database' })
    }

    // send the random word back to whoever made the request as JSON
    res.json({ word })

    // if it fails or crashes, show an error message
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// When the user gives up, they request the answer for their specific word by its id
router.get('/:id/reveal', async (req, res) => {
  try {
    // grab the id from the URL & convert to a number
    const id = Number(req.params.id)

    // look up that specific word in the db by its id
    const wordRow = await db.getWordById(id)

    // if no word matches that id, let the frontend know instead of sending nothing back
    if (!wordRow) {
      return res.status(404).json({ message: 'Word not found' })
    }

    // pull just the text out of the row & send back to user as the "word"
    res.json({ word: wordRow.word })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
