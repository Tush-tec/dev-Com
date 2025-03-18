import axios from "axios"
import { LocalStorage } from "../Utils/app";

const apiClient = axios.create({
    baseURL: "https://dev-com-backend-5nz3g5g1h-tush-tecs-projects.vercel.app/api/v1",
    withCredentials: true,
});


// const apiClient = axios.create({
//     baseURL:"http://localhost:8080/api/v1/",
//     withCredentials: true,
//     timeout:120000
        
// })

apiClient.interceptors.request.use(
    function (config) {
      const token = LocalStorage.get("Token");
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );



const registerUser = (data) =>{
    return apiClient.post('/users/auth/register', data)
}

const loginUser = (data) => {
    return apiClient.post('/users/auth/login', data,)
};


const logOutUser = () => {
    return apiClient.post('/users/auth/logout', {},);
};







const fetchProducts = ({ page = 1, limit = 20 }) => {
    return apiClient.get(`/products/product/all-product?page=${page}&limit=${limit}`);
};

const fetchIndividualProduct =(productId) =>{
    return apiClient.get(`/products/item/${productId}`)
}

const fetchCategory = () =>{
    return apiClient.get(`/categories/get-categories`)
}

const fetchProductForParticularCategory = (categoryId) =>{
    console.log(categoryId);
    return apiClient.get(`/categories/get-product-with-category/${categoryId}`)
}




const getItemFromCart = () => {
    return apiClient.get('/cart/get-cart')
}


const createAddress = (address) => {
    return apiClient.post('/address/create-address', address)
}

const getSaveAddress = (addressId, page = 1, limit = 10) => {    
    return apiClient.get(`/address/get-address/${addressId}?page=${page}&limit=${limit}`);
}

const getAllSaveAddress = () => {    
    return apiClient.get(`/address/get-all-address`)
} 


const deleteSaveAddress = (addressId) => {
    return apiClient.delete(`address/delete-address/${addressId}`)
}




const createOrder = (addressId, paymentMethod) => {
    return apiClient.post("/orders/create-order", { addressId, paymentMethod });
};


const createOrderWithRazorPay = (addressId) => {
    return apiClient.post('/orders/create-order', {
        addressId,
        paymentMethod: "Online"
    });
}

const verifyRazorpayOrder = (paymentResponse) => {
    return apiClient.post('/orders/verify-payment', {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
    });
}


const fetchOrders = (type = "") => {
    return apiClient.get(`orders/order/get/${type}`);
};




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


const contactMe = (formData) =>{
    return apiClient.post('/contact/create-contact', formData)
}






export {
    registerUser,
    loginUser,
    logOutUser,
    fetchProducts,
    fetchIndividualProduct,
    fetchCategory,
    fetchProductForParticularCategory,
    getItemFromCart,
    createAddress,
    deleteSaveAddress,
    createOrder,
    createOrderWithRazorPay,
    verifyRazorpayOrder,
    fetchOrders,
    fetchUserAllInfo,
    updateAvatar,
    updateAccountDetails,
    updatePassword,
    fetchUser,
    getALLUserInfo,
    getSaveAddress,
    getAllSaveAddress,
    contactMe

}   