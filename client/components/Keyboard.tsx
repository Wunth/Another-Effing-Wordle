export default function Keyboard({
  handleKeyPress,
}: {
  handleKeyPress: (key: string) => void
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

  return (
    <div className="keyboard">
      {alphabet.map((letter) => {
        return (
          <button
            key={letter.key}
            type="button"
            onClick={() => handleKeyPress(letter.key)}
          >
            {letter.key}
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => handleKeyPress('backspace')}
        style={{ width: '88px' }}
      >
        ⌫
      </button>
      <button
        type="button"
        onClick={() => handleKeyPress('enter')}
        style={{ width: '88px' }}
      >
        Enter
      </button>
    </div>
  )
}
