import { useEffect, useRef } from 'react'

// Renders the guessing grid: one row per past guess (colored by result), plus the current in-progress row

// Creates the container for the entire Wordle game board
function renderGrid({guesses, currentGuess, maxRows = 6, wordLength = 5}) {
  const grid = document.createElement('div')
grid.className = 'afw-row';
// Loop through and create each row element for the grid
for (let i = 0; i <maxRows; i++) {
  const row = document.createElement('div');
  row.className = 'afw-grid';
// Get past guess data and determine the row text
  const guess = guesses[i];
    const text = guess ? guess.word : (i === guesses.length ? currentGuess : '');

    for (let j = 0; j < wordLength; j++) {
      const tile = document.createElement('div');
      tile.className = 'afw-tile';

  const letter = text[j] || '';
      tile.textContent = letter;

      if (guess?.evaluation?.[j]) {
        tile.classList.add(guess.evaluation[j]);
      } else if (letter) {
        tile.classList.add('filled');
      }

      row.appendChild(tile);
    }

    grid.appendChild(row);
  }

  return grid;
}




 



}

// Returns the box color classes for one letter's result
function colorfor(result: LetterResult) {
  //RIght letter, right position
  if (result === 'correct') return 'bg-green-500 text-white border-greed-500'
  //Right letter, Wrong position
  if (result === 'present') return 'bg-yellow-500 text-white border-yellow-500'
  //Letter not in word
  return 'bg-gray-400 text-white border-gray-400'
}

return (
  <div className="flex flex-col items-center gap-2">
    {/*One row per past guess*/}
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