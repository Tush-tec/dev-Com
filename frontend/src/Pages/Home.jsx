import React from 'react'
import LandingPage from '../Components/LandingPage'
import { useAuth } from '../Utils/AuthContext'

const Home = () => {

  const {isAuthenticated} = useAuth()


  return (
    <>
    {/* {isAuthenticated !== true ?  */}
    
    <LandingPage /> 
    
    
    {/* <section className="container flex items-center justify-center h-screen mx-auto bg-gradient-to-l from-[#162130] to-[#737982]">
            <div className="w-full max-w-md p-8 bg-white text-center shadow-2xl rounded-2xl border border-gray-300">
              <h2 className="text-3xl font-bold text-[#162130] mb-4">
                Access Required
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Please log in to place an order and enjoy seamless shopping!
              </p>
              <div className="flex justify-center">
                <Link to="/login">
                  <button className="bg-[#162130] hover:bg-[#1E293B] text-white py-2 px-5 rounded-full transition-transform transform hover:scale-105 shadow-md">
                    Redirect to Login
                  </button>
                </Link>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#162130] hover:text-[#1E293B] font-semibold hover:underline"
                >
                  Sign up here
                </Link>
                .
              </div>
            </div>
          </section> } */}
    </>
  )
}
  

export default Home