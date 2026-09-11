import Keyboard from './Keyboard.tsx'
import GameBoard from './GameBoard.tsx'
import NewGame from './NewGame.tsx'
import { useKeyPress } from '../hooks/useKeyPress.ts'
import { useState, useCallback } from 'react'
import type { LetterResult } from '../../models/word.ts'

function App() {
  // Tracks whether the current round is still being played, was won, or was given up
  // Starts as 'playing' since a new word is immediately in-progress
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'gaveUp'>(
    'playing',
  )

  // Real guesses state. Starts empty since no guesses have been submitted yet.
  const [guesses, setGuesses] = useState<
    { guess: string; result: LetterResult[] }[]
  >([])

  // holds the id of the word currently being played
  // starts as null because no word has been fetched yet when the page first loads
  const [wordId, setWordId] = useState<number | null>(null)

  // fallback length until a real word loads
  const [wordLength, setWordLength] = useState(5)

  const [currentGuess, setCurrentGuess] = useState('')

  // This function gets called by NewGame once a new word has loaded
  // It saves the word's id/length and resets gameStatus + currentGuess + guesses
  // since a brand new word means a new round just started

  // useCallback keeps this function's identity stable across App re-renders.
  // NewGame's useEffect depends on this function (via the onNewWord prop), so
  // without useCallback, every re-render (e.g. from typing) creates a new
  // function reference, which re-triggers that effect and wipes currentGuess.
  const sendWordInfo = useCallback((id: number, length: number) => {
    setWordId(id)
    setWordLength(length)
    setCurrentGuess('')
    setGuesses([])
    setGameStatus('playing')
  }, [])

  // This function gets called by GiveUp once the word has been revealed
  // It marks the current round as given up
  function handleGiveUp() {
    setGameStatus('gaveUp')
  }

  // Returns true only if every letter in the result came back 'correct'
  function isWinningResult(result: LetterResult[]): boolean {
    return result.every((letter) => letter === 'correct')
  }

  // This function gets called whenever a guess result comes back from the server
  // Uses isWinningResult to check the result and updates gameStatus if it's a win
  function handleWin(result: LetterResult[]) {
    if (isWinningResult(result)) {
      setGameStatus('won')
    }
  }

  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing') return // no input once round is over

    if (key === 'backspace') {
      setCurrentGuess((g) => g.slice(0, -1))
      return
    }
    if (key === 'enter') {
      // check if the conditions to submit an answer are met
      // check result — will eventually call handleWin(result) with the server's response
      return
    }
    if (/^[a-z]$/i.test(key)) {
      setCurrentGuess((g) =>
        g.length < wordLength ? g + key.toUpperCase() : g,
      )
    }
  }
  useKeyPress(handleKeyPress)

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      <NewGame onNewWord={sendWordInfo} />
      <GameBoard
        wordLength={wordLength}
        guesses={guesses}
        currentGuess={currentGuess}
      />
      <Keyboard handleKeyPress={handleKeyPress} />
    </div>
  )
}

export default App
