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
                console.log("Login API Response:", res); 
    
                if (res.statusCode === 200) {
                  const {loggedInUser, accessToken, refreshToken} = res.data
                  console.log(loggedInUser);
                  
                    console.log("Storing token:", accessToken);

    
                    if (loggedInUser && accessToken) {

                        setUser(loggedInUser);
                        setToken(accessToken);
                        setIsAuthenticated(true);

                        LocalStorage.set("User", loggedInUser)
                        LocalStorage.set("Token", accessToken);
                        console.log(LocalStorage.get("Token"));

                        LocalStorage.set("AccessToken", accessToken);
                        LocalStorage.set("RefreshToken", refreshToken)

                        



                        navigate('/');

                    } else {
                        console.error("User or token missing!");
                    }
                }
            },
            (error) => {
                console.error("Login error:", error);
                setIsLoading(false);
            },
            " Login API"
        );
    };
    

    
    

    const logout = async () => {
    console.log("Logout function triggered");
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
    const storedToken = LocalStorage.get("Token");
    const storedUser = LocalStorage.get("User");

    if (storedToken && storedUser?._id) {
        setUser(storedUser);
        setToken(storedToken);
        setIsAuthenticated(true); // Fix: Update isAuthenticated when data is found
    } else {
        console.warn("Token not found or invalid user");
        setIsAuthenticated(false); // Ensures state consistency on page refresh
    }
}, []);

    

    return (
        <AuthContext.Provider value={{ user, token, error,isAuthenticated ,register, login, logout }}>
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };