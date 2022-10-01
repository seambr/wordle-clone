import React, { useState, useEffect, useRef, useContext } from "react"
import Row from "./Row"
import "./Board.css"
import { words } from "./words"
import Keyboard from "./Keyboard"
const COLS = 5
const ROWS = 6
const EMPTY_BOARD = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""]
]

const WOTD = words[Math.floor(Math.random() * words.length)]

export const BoardContext = React.createContext()

function Board() {
  const [board, setBoard] = useState(EMPTY_BOARD)
  const currentRow = useRef(0)
  const currentCol = useRef(0)
  const status = useRef({})
  function isValidGuess() {
    const guess = board[currentRow.current].join("")
    return words.includes(guess)
  }
  function isCorrect() {
    const guess = board[currentRow.current].join("")
    return guess === WOTD
  }

  function shakeTile() {
    const toBeShaked = document.querySelectorAll(
      `[data-row = "${currentRow.current}"]`
    )
    toBeShaked.forEach((element) => {
      element.classList.toggle("shake")
      element.addEventListener(
        "animationend",
        () => {
          element.classList.toggle("shake")
        },
        { once: true }
      )
    })
  }

  function handleKeyDown(event) {
    if (event.repeat) return

    if (event.key === "Enter") {
      if (currentCol.current > 4) {
        if (!isValidGuess()) {
          shakeTile()
          return
        }
        board[currentRow.current].forEach((e, i) => {
          status.current = {
            ...status.current,
            [e]:
              WOTD[i] === e ? "correct" : WOTD.includes(e) ? "present" : "wrong"
          }
        })
        if (isCorrect()) {
          setTimeout(() => {
            alert("YOU WIN")
          }, 500)
        }

        currentRow.current += 1
        currentCol.current = 0
      }
      setBoard(board)
      return
    }
    if (event.key === "Backspace") {
      const newBoard = [...board]
      currentCol.current -= currentCol.current > 0 ? 1 : 0
      newBoard[currentRow.current][currentCol.current] = ""
      setBoard(newBoard)
      return
    }

    if (currentCol.current > 4) return
    if (!event.key.match(/^[a-z]$/i)) return

    const newBoard = [...board]
    newBoard[currentRow.current][currentCol.current] = event.key.toLowerCase()
    currentCol.current += currentCol.current > 4 ? 0 : 1

    setBoard(newBoard)
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <BoardContext.Provider
      value={{
        currCol: currentCol.current,
        currRow: currentRow.current,
        word: WOTD,
        board: board
      }}>
      <div className='Board'>
        {board.map((row, rowIndex) => (
          <Row
            rowArr={row}
            key={rowIndex}
            rowIndex={rowIndex}
            status={status}
          />
        ))}
      </div>
      <Keyboard handleKeyDown={handleKeyDown} word={WOTD} status={status} />
    </BoardContext.Provider>
  )
}

export default Board