import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorage, requestHandler } from "./app";
import { loginUser, logOutUser, registerUser } from "../Api/api";
import Loader from "../Components/Loader";

const AuthContext = createContext({
    user: null,
    token: null,
    register: async () => {},
    login: async () => {},
    logout: async () => {}
});

const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const register = async (data) => {
        setIsLoading(true);
    
        await requestHandler(
            async () => await registerUser(data),
            setIsLoading,
            (res) => {
                alert ("Registration successful", res);
                navigate('/login')
            },
            (error) => {
                setError(error)

            }
        
        );

          
        
    };

    const login = async (data) => {
        setIsLoading(true);
        await requestHandler(
            async () => await loginUser(data), 
            setIsLoading,
            (res) => {
                if (res.statusCode === 200 && res.success === 200) {
                    const user = res.data.loggedInUser;
                    const accessToken = res.data.accessToken;
                    const refreshToken = res.data.refreshToken;

                    console.log("authenticated User", user)

                    if (user && accessToken) {
                        setUser(user);
                        setToken(accessToken);
                        setIsAuthenticated(true)
                        

                        LocalStorage.set("User", user)
                        LocalStorage.set("Token", accessToken);
                        LocalStorage.set("RefreshToken", refreshToken);


                        console.log("User saved in localStorage:", LocalStorage.get("User"));
                        console.log("Token saved in localStorage:", LocalStorage.get("Token"));
                        console.log("RefreshToken saved in localStorage:", LocalStorage.get("RefreshToken"));

                        console.log("using through normal",localStorage.getItem("Token"));
                        console.log(localStorage.getItem("User"));
                        console.log(localStorage.getItem("RefreshToken"));

                    
                        

                        navigate('/');
                        setError(null); 
                    } else {
                        console.error("User or token is missing");
                        setError("User or token is missing.");
                    }
                } else {
                    console.error("Unexpected response format", res);
                    setError("Unexpected response from the server.");
                }
            },
            (error) => {
                console.error("Login error:", error);
                setError(error );
                setIsLoading(false);
            }
        );
    };

    
    

    const logout = async () => {
        setIsLoading(true);
        setError(null); 
    
        await requestHandler(
            async () => await logOutUser(),
            setIsLoading,
            () => {
                setUser(null);
                setToken(null);
                LocalStorage.clear();
                navigate("/login");
            },
            (error) => {
                console.error("Logout failed", error.message || error);
            }
        );
    };

   
    
    

    useEffect(() => {
        console.log("useEffect triggered: Checking stored token and user");
        const storedToken = LocalStorage.get("Token");
        const storedUser = LocalStorage.get("User");
        console.log("Stored Token:", storedToken);
        console.log("Stored User:", storedUser);
        
        if (storedToken && storedUser && storedUser._id) {
            setUser(storedUser);
            setToken(storedToken);
            setIsAuthenticated(true);
        }
    }, []);
    

    

    return (
        <AuthContext.Provider value={{ user, token, error,isAuthenticated ,register, login, logout }}>
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };