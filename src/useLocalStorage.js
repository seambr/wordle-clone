import React, { useState } from "react"
const PREFIX = "wordle-clone-"
function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return defaultValue
    }

    try {
      const val = window.localStorage.getItem(key)
      return val ? JSON.parse(val) : defaultValue
    } catch (error) {
      console.log(error)
      return defaultValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
