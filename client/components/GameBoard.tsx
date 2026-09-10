// Renders the guessing grid: one row per past guess (colored by result), plus the current in-progress row

// The three possible outcomes for a guessed letter
type LetterResult = 'correct' | 'present' | 'absent'

function GameBoard({
  wordLength,
  guesses,
  currentGuess,
}: {
  wordLength: number
  guesses: { guess: string; result: LetterResult[] }[]
  currentGuess: string
}) {
  // Returns the box color classes for one letter's result
  function colorFor(result: LetterResult) {
    // Right letter, right position
    if (result === 'correct') return 'bg-green-500 text-white border-green-500'
    // Right letter, wrong position
    if (result === 'present')
      return 'bg-yellow-500 text-white border-yellow-500'
    // Letter not in the word
    return 'bg-gray-400 text-white border-gray-400'
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* One row per past guess */}
      {guesses.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {/* Split the guessed word into individual letters */}
          {row.guess.split('').map((letter, i) => (
            <div
              key={i}
              className={`flex h-12 w-12 items-center justify-center border-2 text-xl font-bold uppercase ${colorFor(row.result[i])}`}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}

      {/* The row currently being typed, not scored yet */}
      <div className="flex gap-2">
        {/* Creates wordLength empty slots so we always draw the right number of boxes */}
        {Array.from({ length: wordLength }).map((_, i) => (
          <div
            key={i}
            className="flex h-12 w-12 items-center justify-center border-2 border-gray-300 text-xl font-bold uppercase"
          >
            {/* Show the typed letter at this position, or nothing */}
            {currentGuess[i] ?? ''}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameBoard
