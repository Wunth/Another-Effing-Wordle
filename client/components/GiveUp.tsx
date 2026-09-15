// This file renders the Give Up button
// When the user clicks it, it reveals the current word being played

import { useGiveUp } from '../hooks/useGiveUp.ts'
import bruhSound from '../assets/sounds/bruh.mp3'

// GiveUp doesn't know the word's id on its own
// App.tsx passes it down, since App is tracking it
interface GiveUpProps {
  wordId: number
  onGiveUp: (word: string) => void
  isRoundActive: boolean
}

// Create the sound once & reuse every time instead of getting rebuilt every time the component re-renders
const wrongSound = new Audio(bruhSound)

function GiveUp({ wordId, onGiveUp, isRoundActive }: GiveUpProps) {
  // mutate: call this function to trigger revealing the word
  // isPending: true while the reveal request is in progress
  // isError: true if the reveal request failed
  const { mutate, isPending, isError } = useGiveUp()

  return (
    <div className="flex flex-col items-center gap-2">
      {/* clicking Give Up calls mutate with this word's id, revealing it and passing it up to App */}
      <button
        onClick={() => {
          wrongSound.play()
          mutate(wordId, {
            onSuccess: (revealedWord) => {
              onGiveUp(revealedWord)
            },
          })
        }}
        className={`w-40 rounded-lg bg-red-500 px-6 py-3 text-lg font-bold uppercase text-white hover:bg-red-600 ${
          isRoundActive ? '' : 'hidden'
        }`}
        style={{ fontFamily: 'Bungee, cursive' }}
      >
        Give Up
      </button>

      {isPending && <p>Loading...</p>}
      {isError && <p>Could not reveal the word</p>}
    </div>
  )
}

export default GiveUp
