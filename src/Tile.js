import React, { useContext, useState } from "react"
import "./Tile.css"
import { BoardContext } from "./Board"

function Tile({ letter, tileIndex, rowIndex }) {
  const ctx = useContext(BoardContext)
  let state = ""
  if (rowIndex < ctx.currRow) {
    state = ctx.word.includes(letter) ? "present" : "wrong"
    state = ctx.word[tileIndex] == letter ? "correct" : state
  }
  if ((letter != "") & (rowIndex === ctx.currRow)) {
    state = "active"
  }

  return (
    <div className={`Tile ${state}`} data-row={rowIndex}>
      {letter}
    </div>
  )
}

export default Tile
