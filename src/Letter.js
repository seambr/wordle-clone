import React, { useContext } from "react"
import { BoardContext } from "./Board"
import { BsBackspace } from "react-icons/bs"
function Letter({ letter, handleKeyDown, word, status }) {
  const ctx = useContext(BoardContext)
  let state

  if (status.current[letter]) {
    state = status.current[letter] || ""
  }

  return (
    <div
      onClick={() => handleKeyDown({ key: letter, repeat: false })}
      className={`${
        letter !== "" ? (letter.length > 1 ? "special" : "letter") : "space"
      } ${state}`}>
      {(letter === "Backspace" && <BsBackspace />) || letter}
    </div>
  )
}

export default Letter
