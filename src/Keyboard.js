import React from "react"
import Letter from "./Letter"

import "./Keyboard.css"
const letters = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "",
  "Enter",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  "Backspace"
]

function Keyboard({ handleKeyDown, usedLetters, word, status }) {
  return (
    <div className='keyboard'>
      {letters.map((letter, i) => (
        <Letter
          key={i}
          letter={letter}
          handleKeyDown={handleKeyDown}
          usedLetters={usedLetters}
          word={word}
          status={status}
        />
      ))}
    </div>
  )
}

export default Keyboard
