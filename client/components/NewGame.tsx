// This file handles everything related to starting a New Game
import { useNewGame } from '../hooks/useNewGame.ts'

// New Game fetches a word's id & length
// App.tsx needs the id so it can store & remember it
// So when user presses Give up to reveal the word, it knows which word to reveal (by its id)

// The "New Game" button
// Clicking it will fetch a random word from the backend
function NewGame({
  onNewWord,
}: {
  onNewWord: (id: number, length: number) => void
}) {
  // mutate: call this to trigger the fetch
  // isPending: true while the fetch is in progress
  // isError: true if the fetch failed
  const { mutate, isPending, isError } = useNewGame()

  // while the request is running, just show a loading message
  if (isPending) return <p>Loading...</p>

  // if the request failed (e.g. empty word table), show an error message
  if (isError) return <p>No words found</p>

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() =>
          mutate(undefined, {
            onSuccess: (data) => onNewWord(data.id, data.length),
          })
        }
        className="rounded-lg bg-blue-500 px-6 py-3 text-lg font-bold uppercase text-white hover:bg-blue-600"
      >
        New Game
      </button>
    </div>
  )
}

export default NewGame