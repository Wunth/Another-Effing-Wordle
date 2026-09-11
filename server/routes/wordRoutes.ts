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

// When the user submits a guess, check it against the correct word
router.post('/check', async (req, res) => {
  try {
    const { wordId, guess } = req.body
    // call the db function to get the correct word and wait
    const correctWord = await db.getWordById(wordId)

    // if no word matches that id, send a clear error instead of crashing
    if (!correctWord) {
      return res.status(404).json({ message: 'Word not found in the database' })
    }

    if (correctWord.word == guess) {
      res.json({
        result: Array(guess.length).fill('correct'),
        message: correctWord.success_message,
      })
      return
    }

    // call the db function to check the guess and wait
    const result = checkWord(correctWord.word, guess)

    // send the result to the frontend
    res.json({ result })

    // if it fails or crashes, show an error message
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
