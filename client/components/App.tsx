import GameBoard from './GameBoard.tsx'
import NewGame from './NewGame.tsx'
import { useKeyPress } from '../hooks/useKeyPress.ts'
import Keyboard from './Keyboard.tsx'
import GiveUp from './GiveUp.tsx'
import { useState } from 'react'
import { LetterResult } from '../../models/word.ts'

// Temporary fake data just to visually test the grid — will be replaced once
// Features 0-2 (word db, start game, check guess) are ready to plug in
const fakeGuesses = [
  {
    guess: 'crane',
    result: ['absent', 'present', 'correct', 'absent', 'absent'] as const,
  },
]

function App() {
  const handleKeyPress = (key: string) => {
    console.log(key)
  }
  useKeyPress(handleKeyPress)
  // Tracks whether the current round is still being played, was won, or was given up
  // Starts as 'playing' since a new word is immediately in-progress
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'gaveUp'>(
    'playing',
  )

  // holds the id of the word currently being played
  // starts as null because no word has been fetched yet when the page first loads
  const [wordId, setWordId] = useState<number | null>(null)

  // This function gets called by NewGame once a new word has loaded
  // It saves the word's id and resets gameStatus back to 'playing' since a brand new word means a new round just started
  function sendWordInfo(id: number, length: number) {
    setWordId(id)
    setGameStatus('playing')
  }

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

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      {/* NewGame needs sendWordInfo so it can report the new word's id/length back up to App */}
      <NewGame sendWordInfo={sendWordInfo} />

      <GameBoard wordLength={5} guesses={[...fakeGuesses]} currentGuess="tr" />

      {/* Only render GiveUp once a word has actually loaded - before that, wordId is null and there's nothing to give up on. */}
      {/*onGiveUp lets GiveUp tell App the round just ended, so gameStatus can update to 'gaveUp'*/}
      {wordId !== null && (
        <GiveUp key={wordId} wordId={wordId} onGiveUp={handleGiveUp} />
      )}

      <Keyboard handleKeyPress={handleKeyPress} />
    </div>
  )
}

export default App
