import axios from "axios"

const apiClient = axios.create({
    baseURL:" http://localhost:8080/api/v1/"  ,    //import.meta.env.BASE_URL,
    withCredentials:true,
    timeout:120000
})

apiClient.interceptors.request.use(
   

    function(config){

        const token = localStorage.getItem("token")
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
    return apiClient.post('/users/auth/login',data)
}

const logOutUser = (data) => {
    return apiClient.post('/users/auth/logout', data)
}

const fetchProducts = () => {
    return apiClient.get('/products/product/all-product')
}







export {
    registerUser,
    loginUser,
    logOutUser,
    fetchProducts,
}   