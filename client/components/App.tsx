import GameBoard from './GameBoard.tsx'
import NewGame from './NewGame.tsx'

// Temporary fake data just to visually test the grid — will be replaced once
// Features 0-2 (word db, start game, check guess) are ready to plug in
const fakeGuesses = [
  {
    guess: 'crane',
    result: ['absent', 'present', 'correct', 'absent', 'absent'] as const,
  },
]

function App() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      <NewGame />
      <GameBoard wordLength={5} guesses={[...fakeGuesses]} currentGuess="tr" />
    </div>
  )
}

export default App
