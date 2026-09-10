import { useState } from "react"

export default function Keyboard() {
  const alphabet = [
    { key: "a" }, { key: "b" }, { key: "c" }, { key: "d" }, { key: "e" },
    { key: "f" }, { key: "g" }, { key: "h" }, { key: "i" }, { key: "j" },
    { key: "k" }, { key: "l" }, { key: "m" }, { key: "n" }, { key: "o" },
    { key: "p" }, { key: "q" }, { key: "r" }, { key: "s" }, { key: "t" },
    { key: "u" }, { key: "v" }, { key: "w" }, { key: "x" }, { key: "y" },
    { key: "z" },
  ]

  const [letters, setLetters] = useState(alphabet)

 function handleKeyPress(key: string) {
  console.log(key)
 }

  return (
    <div className="keyboard">
      {letters.map((letter) => {
        return (
        <button
          key={letter.key}
          type="button"
          onClick={() => handleKeyPress(letter.key)}
        >
          {letter.key}
      </button>)
      })}
    </div>
  )
}