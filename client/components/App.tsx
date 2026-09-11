import GameBoard from './GameBoard.tsx'
import NewGame from './NewGame.tsx'
import Keyboard from './Keyboard.tsx'
import GiveUp from './GiveUp.tsx'
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
  // holds the id of the word currently being played
  // starts as null because no word has been fetched yet when the page first loads
  const [wordId, setWordId] = useState<number | null>(null)

  // This function gets called by NewGame once a new word has loaded
  // It's only job is to save that word's id into App's state so other components that need it (like GiveUp) can use it
  function sendWordInfo(id: number, length: number) {
    setWordId(id)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      {/* NewGame needs sendWordInfo so it can report the new word's id/length back up to App */}
      <NewGame sendWordInfo={sendWordInfo} />

      <GameBoard wordLength={5} guesses={[...fakeGuesses]} currentGuess="tr" />

      {/* Only render GiveUp once a word has actually loaded - before that, wordId is null and there's nothing to give up on */}
      {wordId !== null && <GiveUp key={wordId} wordId={wordId} />}

      <Keyboard />
    </div>
  )
}

export default App
