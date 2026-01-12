import { useState } from 'react'
import './App.css'
import Button from './Components/Button'

function App() {
  const [count, setcount] = useState(0)

  function countUp () {
    setcount(count + 1)
  }

  return (
    <>
    <Button onClick={countUp}/>
    <p>{count}</p>
    </>
  )
}

export default App
