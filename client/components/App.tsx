import { useState } from 'react'
import GameBoard from './GameBoard.tsx'
import NewGame from './NewGame.tsx'
import Keyboard from './Keyboard.tsx'
import GiveUp from './GiveUp.tsx'
import Popup from './Popup.tsx'
import { StatsPanel } from './StatsPanel.tsx'
import { useKeyPress } from '../hooks/useKeyPress.ts'
import { useCheckGuess } from '../hooks/useCheckGuess.ts'
import { LetterResult } from '../../models/word.ts'
import { useConfettiRain } from '../hooks/useConfettiRain.ts'

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
  const [wordLength, setWordLength] = useState(0)

  const { mutate: submitGuess } = useCheckGuess()

  // Gives us a function to trigger the confetti burst on a win
  const { triggerConfettiRain } = useConfettiRain()

  const [currentGuess, setCurrentGuess] = useState('')

  const [letterStatuses, setLetterStatuses] = useState<
    Record<string, LetterResult>
  >({})
  const [winMessage, setWinMessage] = useState<string | null>(null)

  // Tracks whether the end-of-round popup is currently visible (separate from
  // gameStatus so the player can manually close it without losing their result)
  const [showPopup, setShowPopup] = useState(false)

  // This function gets called by NewGame once a new word has loaded
  // It saves the word's id/length and resets gameStatus + currentGuess + guesses
  // since a brand new word means a new round just started
  function sendWordInfo(id: number, length: number) {
    setWordId(id)
    setWordLength(length)
    setCurrentGuess('')
    setGuesses([])
    setLetterStatuses({})
    setWinMessage(null)
    setGameStatus('playing')
    setShowPopup(false)
  }

  function updateLetterStatuses(guess: string, result: LetterResult[]) {
    setLetterStatuses((prev) => {
      const next = { ...prev }
      guess.split('').forEach((letter, i) => {
        const newStatus = result[i]
        const currentStatus = next[letter]

        // only upgrade: correct > present > absent
        if (
          currentStatus === 'correct' ||
          (currentStatus === 'present' && newStatus === 'absent')
        ) {
          return // keep the existing better status
        }
        next[letter] = newStatus
      })
      return next
    })
  }

  // This function gets called by GiveUp once the word has been revealed
  // It marks the current round as given up
  function handleGiveUp() {
    setGameStatus('gaveUp')
    setShowPopup(true)
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
      setShowPopup(true)
      triggerConfettiRain()
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
      // only submit once the guess is actually full-length
      if (currentGuess.length !== wordLength || wordId === null) return

      submitGuess(
        { wordId, guess: currentGuess },
        {
          onSuccess: (data) => {
            setGuesses((prev) => [
              ...prev,
              { guess: currentGuess, result: data.result },
            ])
            updateLetterStatuses(currentGuess, data.result)
            setCurrentGuess('')
            handleWin(data.result)
            if (data.message) {
              setWinMessage(data.message)
            }
          },
        },
      )
      return
    }
    if (/^[a-z]$/i.test(key)) {
      setCurrentGuess((g) =>
        g.length < wordLength ? g + key.toLowerCase() : g,
      )
    }
  }
  useKeyPress(handleKeyPress)

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      {/* NewGame needs sendWordInfo so it can report the new word's id/length back up to App */}

      <NewGame onNewWord={sendWordInfo} />
      <GameBoard
        wordLength={wordLength}
        guesses={guesses}
        currentGuess={currentGuess}
        gameStatus={gameStatus}
      />

      <Popup isOpen={showPopup} onClose={() => setShowPopup(false)}>
        {gameStatus === 'won' && (
          <p className="text-lg font-bold text-green-600">
            {winMessage ?? 'You got it!'}
          </p>
        )}
        {gameStatus === 'gaveUp' && (
          <p className="text-lg font-bold text-gray-600">
            Better luck next time!
          </p>
        )}
      </Popup>

      {/* Only show GiveUp once a word has actually loaded - before that, wordId is null and there's nothing to give up on. */}
      {/* onGiveUp lets GiveUp tell App the round just ended, so gameStatus can update to 'gaveUp' */}
      {wordId !== null && (
        <GiveUp
          key={wordId}
          wordId={wordId}
          onGiveUp={handleGiveUp}
          isRoundActive={gameStatus === 'playing'}
        />
      )}

      <StatsPanel />

      <Keyboard
        handleKeyPress={handleKeyPress}
        letterStatuses={letterStatuses}
      />
    </div>
  )
}

export default App
