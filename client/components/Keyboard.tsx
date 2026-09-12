import type { LetterResult } from '../../models/word.ts'

export default function Keyboard({
  handleKeyPress,
  letterStatuses,
}: {
  handleKeyPress: (key: string) => void
  letterStatuses: Record<string, LetterResult>
}) {
  const alphabet = [
    { key: 'a' },
    { key: 'b' },
    { key: 'c' },
    { key: 'd' },
    { key: 'e' },
    { key: 'f' },
    { key: 'g' },
    { key: 'h' },
    { key: 'i' },
    { key: 'j' },
    { key: 'k' },
    { key: 'l' },
    { key: 'm' },
    { key: 'n' },
    { key: 'o' },
    { key: 'p' },
    { key: 'q' },
    { key: 'r' },
    { key: 's' },
    { key: 't' },
    { key: 'u' },
    { key: 'v' },
    { key: 'w' },
    { key: 'x' },
    { key: 'y' },
    { key: 'z' },
  ]

  function statusClass(letter: string) {
    const status = letterStatuses[letter]
    if (status === 'correct') return 'bg-green-500 text-white'
    if (status === 'present') return 'bg-yellow-500 text-white'
    if (status === 'absent') return 'bg-gray-400 text-white'
    return 'bg-gray-200'
  }

  return (
    <div className="keyboard">
      {alphabet.map((letter) => (
        <button
          key={letter.key}
          type="button"
          onClick={() => handleKeyPress(letter.key)}
          className={statusClass(letter.key)}
        >
          {letter.key}
        </button>
      ))}
      <button
        type="button"
        onClick={() => handleKeyPress('backspace')}
        style={{ width: '48px' }}
        className="bg-gray-200"
      >
        ⌫
      </button>
      <div className="btn_enter">
        <button
          type="button"
          onClick={() => handleKeyPress('enter')}
          className="bg-gray-200"
        >
          Enter
        </button>
      </div>
    </div>
  )
}
