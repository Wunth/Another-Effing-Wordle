// This file handles everything related to starting a New Game

import { useNewGame } from '../hooks/useNewGame.ts'

// The "New Game" button
// Clicking it will fetch a random word from the backend
function NewGame() {
  // mutate: call this to trigger the fetch
  // data: the word once it's loaded
  // isPending: true while the fetch is in progress
  // isError: true if the fetch failed
  const { mutate, data, isPending, isError } = useNewGame()

  // while the request is running, just show a loading message
  if (isPending) return <p>Loading...</p>

  // if the request failed (e.g. empty word table), show an error message
  if (isError) return <p>No words found</p>

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => mutate()}
        className="rounded-lg bg-blue-500 px-6 py-3 text-lg font-bold uppercase text-white hover:bg-blue-600"
      >
        New Game
      </button>
    </div>
  )
}

export default NewGame
