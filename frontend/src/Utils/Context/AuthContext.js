import { Children, createContext, useContext, useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { LocalStorage, requestHandler } from "../app";
import { loginUser, logOutUser, registerUser } from "../../Api/api";
import Loader from "../../Components/Loader";



const AuthContext = createContext({
    user:null,
    token:null,
    register: async () =>{},
    login: async () => {},
    logout: async () => {}
})

const useAuth = () =>{
    return useContext(AuthContext)
}

const AuthProvider = ({ children}) =>{

    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [token , setToken ] = useState(null)
    const navigate = useNavigate()

    const register = async (data) => {

        await  requestHandler(
            async () => {
                return await registerUser(data)
            },
            setIsLoading,
            () => {
                alert("Account Created Successfull, Go Ahead and Login")
                navigate('/login')
            },

        )
    }


    const login = async (data) =>{

        await requestHandler(
            async () => await loginUser(data),
            setIsLoading,

            (res) => {
                const {data} = res
                setUser(data.user)
                setToken(data.accessToken)
                LocalStorage.set('User', data.user)
                LocalStorage.set('Token', data.accessToken)
                navigate('/')
            },

            (error) =>{
                console.error("Login Failed, Please re-check Login with Valid Name or Password!", error.message || error)
            }
        )
    }

    const logout = async () => {
        await requestHandler (
            async() => logOutUser(),
            setIsLoading,
            ()=>{
                setUser(null);
                setToken(null);
                LocalStorage.clear();
                navigate('/login')
            },
            (error)=>{
                console.error("Logout Failed", error.message || error)
            }


        )
    }



    useEffect(() =>{

        const storedToken = LocalStorage.get('Token');
        const storedUser = LocalStorage.get('User');

        if (storedToken && storedUser && storedUser._id) {
            setUser(storedUser);
            setToken(storedToken);
        }

    },[])

    return(
        <AuthContext.Provider value={
            {
                user,
                token,
                register,
                login,
                logout
            }
        }
        >
            {
                isLoading ? <Loader/>: Children
            }
        </AuthContext.Provider>
    )

}



