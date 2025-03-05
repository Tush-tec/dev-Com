import axios from "axios"

const apiClient = axios.create({
    baseURL:"http://localhost:8080/api/v1/",    //import.meta.env.BASE_URL,
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

const fetchProducts = ({ page = 1, limit = 20 }) => {
    return apiClient.get(`/products/product/all-product?page=${page}&limit=${limit}`);
};



const getItemFromCart = () => {
    return apiClient.get('/cart/get-cart')
}


const createAddress = (address) => {
    return apiClient.post('/address/create-address', address)
}

const getSaveAddress = (addressId) => {    
    return apiClient.get(`/address/get-address/${addressId}`)
} 

const createOrder =(data) => {
    return apiClient.post('/order/create-order', address)
}

const fetchUserAllInfo = (data) =>{
    return apiClient.get('/users/account-details', data)
}

const fetchUser = (userId) => {
    return apiClient.get(`/users/user/${userId}`);
};

const getALLUserInfo = (data) => {
    return apiClient.get('/users/account-details', data)
}

const updateAvatar = (formData) => {
    return apiClient.patch('/users/update-avatar', formData)
}

const updateAccountDetails = (data) => {
    return apiClient.patch('/users/update-account-details', data)
}

const updatePassword = (formData) => {
    return apiClient.patch('/users/auth/change-user-password', formData)
} 





export {
    registerUser,
    loginUser,
    logOutUser,
    fetchProducts,
    getItemFromCart,
    createAddress,
    createOrder,
    fetchUserAllInfo,
    updateAvatar,
    updateAccountDetails,
    updatePassword,
    fetchUser,
    getALLUserInfo,
    getSaveAddress

}   