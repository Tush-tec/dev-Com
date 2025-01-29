import { useState } from 'react'

import './App.css'
import LandingPage from './Components/LandingPage'
import { Router, Routes, Route } from 'react-router-dom'
import RegisterForm from './Components/Form/RegisterForm'
import LoginForm from './Components/Form/LoginForm'

function App() {

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    

    <LandingPage/>  
    </>
  )
}

export default App
