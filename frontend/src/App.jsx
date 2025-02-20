import { useState } from 'react'

import './App.css'
import LandingPage from './Components/LandingPage'
import { Router, Routes, Route } from 'react-router-dom'
import RegisterForm from './Components/Form/RegisterForm'
import LoginForm from './Components/Form/LoginForm'
import CheckOut from './Pages/CheckOut'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path='/checkout' element = {<CheckOut/>}/>
      </Routes>
    

      
    </>
  )
}

export default App  
