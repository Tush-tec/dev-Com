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

                    if (user && accessToken) {
                        setUser(user);
                        setToken(accessToken);
                        setIsAuthenticated(true)


                        localStorage.setItem("User", user)
                        localStorage.setItem("Token", accessToken)
                        localStorage.setItem("RefreshToken", refreshToken)

                        // LocalStorage.set("User", user)
                        // LocalStorage.set("Token", accessToken);
                        // LocalStorage.set("RefreshToken", refreshToken);

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
        const storedToken = localStorage.getItem("Token")
        const storedUser = localStorage.getItem("User")

        if (storedToken && storedUser && storedUser._id) {
            setUser(storedUser);
            setToken(storedToken);
            setIsAuthenticated(true)
        }
    }, []);

    

    return (
        <AuthContext.Provider value={{ user, token, error,isAuthenticated ,register, login, logout }}>
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };