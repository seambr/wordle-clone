import React from "react"
import Tile from "./Tile"
function Row({ rowArr, rowIndex, status }) {
  return (
    <>
      {rowArr.map((value, index) => (
        <Tile
          letter={value}
          key={index}
          tileIndex={index}
          rowIndex={rowIndex}
        />
      ))}
    </>
  )
}

export default Row
