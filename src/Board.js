import React, { useState, useEffect, useRef, useContext } from "react";
import Row from "./Row";
import "./Board.css";
import { words } from "./words";
import Keyboard from "./Keyboard";
import useLocalStorage from "./useLocalStorage";
import { IoStatsChartSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
const COLS = 5;
const ROWS = 6;
const EMPTY_BOARD = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];
let startDate = new Date("10/1/2022");
let today = new Date();
const days = (startDate, today) => {
  let difference = startDate.getTime() - today.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return -TotalDays;
};

const WOTD = words[days(startDate, today)];

export const BoardContext = React.createContext();

function Board() {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const gameOver = useRef(false);
  const currentRow = useRef(0);
  const currentCol = useRef(0);
  const status = useRef({});
  const [displayAlert, setDisplayAlert] = useState({
    bool: false,
  });
  const gamePaused = useRef(false);
  const [showEndGame, setShowEndGame] = useState(false);
  const [stats, setStats] = useLocalStorage("statistics", {
    wins: 0,
    winstreak: 0,
    gamesPlayed: 0,
  });

  function changeOpenStats(open, stay = false) {
    if (!stay) {
      gamePaused.current = open;
    }
    setShowEndGame(open);
  }
  function isValidGuess() {
    const guess = board[currentRow.current].join("");
    return words.includes(guess);
  }
  function isCorrect() {
    const guess = board[currentRow.current].join("");
    return guess === WOTD;
  }

  function shakeTile() {
    const toBeShaked = document.querySelectorAll(
      `[data-row = "${currentRow.current}"]`
    );
    toBeShaked.forEach((element) => {
      element.classList.toggle("shake");
      element.addEventListener(
        "animationend",
        () => {
          element.classList.toggle("shake");
        },
        { once: true }
      );
    });
  }

  function handleKeyDown(event) {
    if (gamePaused.current) return;
    if (event.repeat) return;

    if (event.key === "Enter") {
      if (currentCol.current > COLS - 1) {
        if (!isValidGuess()) {
          shakeTile();
          setDisplayAlert({ bool: true, message: "Not a valid guess" });
          return;
        }
        board[currentRow.current].forEach((e, i) => {
          status.current = {
            ...status.current,
            [e]:
              WOTD[i] === e
                ? "correct"
                : WOTD.includes(e)
                ? "present"
                : "wrong",
          };
        });
        // Winning
        if (isCorrect()) {
          gameOver.current = true;
          setDisplayAlert({ bool: true, message: "You Win!" });
          setStats((old) => {
            const currentStreak = old.winstreak + 1;
            const gamesPlayed = old.gamesPlayed + 1;
            return {
              wins: old.wins + 1,
              winstreak: currentStreak,
              gamesPlayed: gamesPlayed,
            };
          });
          changeOpenStats(true);
        }

        currentRow.current += 1;
        currentCol.current = 0;

        // Losing
        if (currentRow.current > ROWS - 1) {
          gameOver.current = true;
          setDisplayAlert({ bool: true, message: WOTD });
          changeOpenStats(true);

          setStats((old) => {
            const gamesPlayed = old.gamesPlayed + 1;
            return {
              ...old,
              winstreak: 0,
              gamesPlayed: gamesPlayed,
            };
          });
        }
      }
      setBoard((old) => [...old]);
      return;
    }

    if (event.key === "Backspace") {
      const newBoard = [...board];
      currentCol.current -= currentCol.current > 0 ? 1 : 0;
      newBoard[currentRow.current][currentCol.current] = "";
      setBoard(newBoard);
      return;
    }

    if (currentCol.current > COLS - 1) return;
    if (!event.key.match(/^[a-z]$/i)) return;

    const newBoard = [...board];
    newBoard[currentRow.current][currentCol.current] = event.key.toLowerCase();
    currentCol.current += currentCol.current > COLS - 1 ? 0 : 1;

    setBoard(newBoard);
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="nav">
        <span className="title">Wordle Clone</span>
        <IoStatsChartSharp
          className="icon"
          size="30"
          onClick={() => changeOpenStats(true)}
        />
      </div>
      <BoardContext.Provider
        value={{
          currCol: currentCol.current,
          currRow: currentRow.current,
          word: WOTD,
          board: board,
        }}
      >
        <div className="Board">
          {board.map((row, rowIndex) => (
            <Row
              rowArr={row}
              key={rowIndex}
              rowIndex={rowIndex}
              status={status}
            />
          ))}
        </div>
        {displayAlert.bool === true && (
          <Alert
            setDisplayAlert={setDisplayAlert}
            message={displayAlert.message}
          />
        )}
        {showEndGame && (
          <Modal changeOpenStats={changeOpenStats} stats={stats} />
        )}
        <Keyboard handleKeyDown={handleKeyDown} word={WOTD} status={status} />
      </BoardContext.Provider>
    </>
  );
}

function Alert({ setDisplayAlert, message, time }) {
  useEffect(() => {
    const c = setTimeout(() => {
      setDisplayAlert({ bool: false });
      console.log("waeaa");
    }, time || 2000);
    return () => clearTimeout(c);
  }, []);

  return <div className="alert">{message}</div>;
}
function Modal({ changeOpenStats, stats }) {
  // const [isShown, setIsShown] = useState(false)

  // useEffect(() => {
  //   const c = setTimeout(() => {
  //     setIsShown(true)
  //   }, 2000)
  //   return () => clearTimeout(c)
  // }, [])

  return (
    <div className="modal">
      <span style={{ fontSize: "1.5em" }}>Statistics</span>
      <div className="stat-container">
        <StatBox statName={"Wins"} stat={stats.wins} />
        <StatBox statName={"Games Played"} stat={stats.gamesPlayed} />
        <StatBox statName={"Win Streak"} stat={stats.winstreak} />
      </div>
      <IoMdClose
        size={25}
        className="icon"
        onClick={() => changeOpenStats(false, true)}
      />
    </div>
  );
}

function StatBox({ statName, stat }) {
  const statNameList = statName.split(" ");
  return (
    <div className="stat-box">
      <span className="stat">{stat}</span>
      {statNameList.map((word, i) => (
        <span key={i}>{word}</span>
      ))}
    </div>
  );
}

export default Board;
