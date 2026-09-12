// This file renders the Give Up button
// When the user clicks it, it reveals the current word being played

import { useGiveUp } from '../hooks/useGiveUp.ts'

// GiveUp doesn't know the word's id on its own
// App.tsx passes it down, since App is tracking it
interface GiveUpProps {
  wordId: number
  onGiveUp: () => void
  isRoundActive: boolean
}

function GiveUp({ wordId, onGiveUp, isRoundActive }: GiveUpProps) {
  // mutate: call this function to trigger revealing the word
  // data: the revealed word
  // isPending: true while the reveal request is in progress
  // isError: true if the reveal request failed
  const { mutate, data, isPending, isError } = useGiveUp()

  return (
    <div className="flex flex-col items-center gap-2">
      {/* clicking Give Up calls mutate with this word's id, triggering revealWord(id) */}
      <button
        onClick={() => mutate(wordId, { onSuccess: () => onGiveUp() })}
        className={`rounded-lg bg-red-500 px-6 py-3 text-lg font-bold uppercase text-white hover:bg-red-600 ${
          isRoundActive ? '' : 'hidden'
        }`}
      >
        Give Up
      </button>

      {isPending && <p>Loading...</p>}
      {isError && <p>Could not reveal the word</p>}
      {data && (
        <>
          <p>The word was:</p>
          <p className="giveUpReveal">{data}</p>
        </>
      )}
    </div>
  )
}

export default GiveUp
