import React, { useState } from 'react'
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useAuth } from '../../Utils/AuthContext'
import Input from '../Input';
import Button from '../Button';

const LoginForm = () => {

    const [userLogin, setUserLogin ] = useState(
        {
            username:"",
            password:""
        }
    )

    const [error, setError] = useState("")

     const {login} = useAuth()
    const handleOnChange = (e) =>{ 
        const {name, value } = e.target

        setUserLogin(
            {
                ...userLogin,
                [name]: value
            }
        )


        setError("")
    }

 


    const handleOnSubmit = async (e) => {
  

      try {
        await login(
          userLogin.username,
          userLogin.password
        )
        console.log(login)
        console.log(userLogin)

      } catch (error) {
        console.error(error.message)


        if(error.response &&  error.response.data){
          setError(error.response.data.message)
        }        
      }
    }

    return (
        <div className="flex justify-center items-center flex-col h-screen w-screen">
          <h1 className="text-3xl font-bold">Login Devcom </h1>
          <div className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]">
            <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
              <LockClosedIcon className="h-8 w-8 mb-2" /> Login
            </h1>
            

            <Input
              placeholder="Enter the username..."
              name="username"
              value={userLogin.username}
              onChange={handleOnChange}
            />
    
            <Input
              placeholder="Enter the password..."
              name="password"
              type="password"
              value={userLogin.password}
              onChange={handleOnChange}
            />
    
            {error && <p className="text-red-500 text-sm">{error}</p>}
    
            <Button
              disabled={Object.values(userLogin).some((val) => !val)}
              onClick={ handleOnSubmit}
            >
              Login
            </Button>
    
            {/* Link to the registration page */}
            <small className="text-zinc-900">
              Don&apos;t have an account?{" "}
              <a className="text-blue-700  hover:underline" href="/register">
                Register
              </a>
            </small>
          </div>
        </div>
 )  
}

export default LoginForm