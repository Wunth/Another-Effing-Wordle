// This file has the route that fetches a random word from the db

import { Router } from 'express'
import * as db from '../db/words.ts'
import { checkWord } from './routeFunctions/checkWord.ts'

import { getUserByAuth0Id, addUser } from '../db/users.ts'
import checkJwt, { optionalCheckJwt, JwtRequest } from '../auth.ts'

import {
  createGameRecord,
  getGamesByUserId,
  getAverageGuessesForUser,
} from '../db/games.ts'

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
    const id = Number(req.params.id)
    const wordRow = await db.getWordById(id)
    if (!wordRow) {
      return res.status(404).json({ message: 'Word not found' })
    }
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
    const correctWord = await db.getWordById(wordId)
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
    const result = checkWord(correctWord.word, guess)
    res.json({ result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// When a round finishes (win or give-up), submit the complete record in one go.
// Guests never hit this — the client only calls it when logged in.
router.post('/games', optionalCheckJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    if (!auth0Id) {
      return res.status(401).json({ message: 'Login required' })
    }

    const { wordId, startTime, endTime } = req.body

    let user = await getUserByAuth0Id(auth0Id)
    if (!user) {
      user = await addUser({ auth0_id: auth0Id, name: auth0Id })
    }

    const game = await createGameRecord({
      wordId,
      userId: user.id,
      startTime,
      endTime,
    })

    res.json(game)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/stats', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const user = await getUserByAuth0Id(auth0Id!)

    if (!user) {
      return res.json({ gamesPlayed: 0, games: [], averageGuesses: 0 })
    }

    const games = await getGamesByUserId(user.id)
    const averageGuesses = await getAverageGuessesForUser(user.id)

    res.json({
      gamesPlayed: games.length,
      games,
      averageGuesses,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
