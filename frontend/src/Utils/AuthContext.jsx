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
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

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
        console.log("Received data in login:", data);
        setIsLoading(true);
        
        try {
            await requestHandler(
                async () => await loginUser(data),
                (res) => {
                    const { data } = res;
                    setUser(data.user);
                    setToken(data.accessToken);
                    LocalStorage.set("User", data.user);
                    LocalStorage.set("Token", data.accessToken);
                    navigate("/");
                },
                (error) => {
                    console.error("Login Failed, Please check login with valid credentials!", error.message || error);
                }
            );
        } catch (error) {
            console.error("Login error:", error.message || error);
        } finally {
            setIsLoading(false); // Ensure loading is reset
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await requestHandler(
                async () => await logOutUser(),
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