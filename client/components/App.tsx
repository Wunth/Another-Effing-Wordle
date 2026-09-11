import Keyboard from './Keyboard.tsx'
import GameBoard from './GameBoard.tsx'
import NewGame from './NewGame.tsx'
import { useKeyPress } from '../hooks/useKeyPress.ts'
import { useState } from 'react'

// Temporary fake data just to visually test the grid — will be replaced once
// Features 0-2 (word db, start game, check guess) are ready to plug in
const fakeGuesses = [
  {
    guess: 'crane',
    result: ['absent', 'present', 'correct', 'absent', 'absent'] as const,
  },
]

function App() {
  const wordLength = 5
  const [currentGuess, setCurrentGuess] = useState('')
  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setCurrentGuess((g) => g.slice(0, -1))
      return
    }
    if (key === 'enter') {
      // check if the conditions to submit an answer are met
      // check result
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
      <NewGame />
      <GameBoard
        wordLength={wordLength}
        guesses={[...fakeGuesses]}
        currentGuess={currentGuess}
      />
      <Keyboard handleKeyPress={handleKeyPress} />
    </div>
  )
}

export default App
