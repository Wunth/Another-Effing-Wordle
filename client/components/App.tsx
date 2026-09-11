import Keyboard from './Keyboard.tsx'
import GameBoard from './GameBoard.tsx'
import NewGame from './NewGame.tsx'
import { useKeyPress } from '../hooks/useKeyPress.ts'

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
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      <NewGame />
      <GameBoard wordLength={5} guesses={[...fakeGuesses]} currentGuess="tr" />
      <Keyboard handleKeyPress={handleKeyPress} />
    </div>
  )
}

export default App
