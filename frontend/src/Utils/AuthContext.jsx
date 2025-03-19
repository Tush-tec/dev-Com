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
                if (res.statusCode === 200) {
                    const { loggedInUser, accessToken } = res.data;

                    if (loggedInUser && accessToken) {
                        setUser(loggedInUser);
                        setToken(accessToken);
                        setIsAuthenticated(true);

                        LocalStorage.set("User", loggedInUser);
                        LocalStorage.set("Token", accessToken);  

                        navigate('/');
                    } else {
                        console.error("User or token missing!");
                    }
                }
            },
            (error) => {
                console.error("Login error:", error);
                setError(error); 
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
                setIsAuthenticated(false);
                LocalStorage.clear();
                navigate("/login");
            },
            (error) => {
                console.error("Logout failed", error.message || error);
                setError("Logout failed. Please try again.");
            }
        );
    };


  
    
    
    useEffect(() => {
        const storedToken = LocalStorage.get("Token");
        const storedUser = LocalStorage.get("User");

        if (storedToken && storedUser?._id) {
            setUser(storedUser);
            setToken(storedToken);
            setIsAuthenticated(true);
        } else {
            console.warn("Token not found or invalid user");
            setIsAuthenticated(false);
        }
    }, []);

    

    return (
        <AuthContext.Provider value={{ user, token, error,isAuthenticated ,register, login, logout }}>
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };