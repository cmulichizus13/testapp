import React from 'react'
import './App.css'
import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from './Routes'

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/testapp/">
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App