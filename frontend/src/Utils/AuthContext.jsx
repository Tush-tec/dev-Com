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

    const register = async (data) => {
        setIsLoading(true);
        try {
            await requestHandler(async () => await registerUser(data));
            alert("Account Created Successfully, Go Ahead and Login");
            navigate("/login");
        } catch (error) {
            console.error("Registration failed", error);
            setIsLoading(false);
        }
    };

    const login = async (data) => {
        setIsLoading(true);
        const response = await loginUser(data);
        console.log("Login Response:", response);
        try {
            await requestHandler(

                async () => await loginUser(data),
                setIsLoading,
                (res) => {
                    if (res.statusCode === 200 && res.success === 200) {
                
                        const user = res.data.loggedInUser;
                        const accessToken = res.data.accessToken;
                        const refreshToken = res.data.refreshToken;
                        
                        if (user && accessToken) {
                            setUser(user.username);
                            setToken(accessToken);
                            LocalStorage.set("Token", accessToken);
                            LocalStorage.set("RefreshToken", refreshToken);
                            
                            navigate('/');
                        } else {
                            console.error("User or token is missing");
                        }
                    } else {
                        console.error("Unexpected response format", res);
                    }
                },
                (error) => {
                    console.error("Login error:", error.message || error);
                }
            );
        } catch (error) {
            console.error("Login error:", error.message || error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const logout = async () => {
        setIsLoading(true);
        try {
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
                    setIsLoading(false);
                }
            );
        } catch (error) {
            console.error("Logout error:", error.message || error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const storedToken = LocalStorage.get("Token");
        const storedUser = LocalStorage.get("User");

        if (storedToken && storedUser && storedUser._id) {
            setUser(storedUser);
            setToken(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, register, login, logout }}>
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };