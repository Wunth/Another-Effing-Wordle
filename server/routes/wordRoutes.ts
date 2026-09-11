// This file has the route that fetches a random word from the db

import { Router } from 'express'

import * as db from '../db/words.ts'

import { checkWord } from './routeFunctions/checkWord.ts'

const router = Router()

// When the user makes a GET request to /random, run this function
router.get('/random', async (req, res) => {
  try {
    // call the db function to get a random word and wait
    const word = await db.getRandomWord()

    // if no word came back or the table is empty
    // send 404 error (not 500 as it is not a server error)
    if (!word) {
      return res.status(404).json({ message: 'No words found in the database' })
    }

    // send id + length to the frontend (not the actual word)
    res.json({ id: word.id, length: word.word.length })

    // if it fails or crashes, show an error message
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.post('/check', async (req, res) => {
  try {
    const { wordId, guess } = req.body
    // call the db function to get the correct word and wait
    const correctWord = await db.getWordById(wordId)
    if (correctWord.word == guess) {
      res.json({
        result: Array(guess.length).fill('correct'),
        message: correctWord.success_message,
      })
      return
    }
    console.log('Correct word:', await correctWord)
    // call the db function to check the guess and wait
    const result = checkWord(correctWord.word, guess)

    // if no result came back or the table is empty
    // send 404 error (not 500 as it is not a server error)
    if (!correctWord) {
      return res.status(404).json({ message: 'Word not found in the database' })
    }

    // send the result to the frontend
    res.json({ result })

    // if it fails or crashes, show an error message
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
