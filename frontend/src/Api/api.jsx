import axios from "axios"

const apiClient = axios.create({
    baseURL:" http://localhost:8080/api/v1/"  ,    //import.meta.env.BASE_URL,
    withCredentials:true,
    timeout:120000
})

apiClient.interceptors.request.use(
    // Add Logic in a function that will use  before sending the request to the server, set token in the localstorage, set headers or  modifying request

    function(config){

        // Retrieve user token from local storage
        const token = localStorage.getItem("token")

        // Set authorization header with bearer token

        config.headers.Authorization = `Bearer ${token}`

        return config
    },
    (error)=>{
        return Promise.reject(error.message || error)
    }
)


const registerUser = (data) =>{
    return apiClient.post('/users/auth/register', data)
}

const loginUser = (data)=>{
    // console.log(data)
    return apiClient.post('/users/auth/login',data)
}

const logOutUser = (data) => {
    return apiClient.post('/users/auth/logout', data)
}


export {
    registerUser,
    loginUser,
    logOutUser
}