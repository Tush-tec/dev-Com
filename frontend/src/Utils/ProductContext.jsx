import { createContext, useContext, useState } from "react";
import { requestHandler } from "./app";
import {  fetchProducts } from "../Api/api";

const ProductContext = createContext({
    products: [],
    category: null,
    loading: false,
    error: null,
    getAllProducts: async () => {},
});

     const useProducts = () => {
    return useContext(ProductContext);
};

 const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAllProducts = async (data) => {
        setLoading(true);
        setError(null);

        try {
            await requestHandler(
                async () => fetchProducts(data),
                setLoading,
                (res) => {
                    setProducts(res.data);

                }
            )
            

        } catch (error) {
            
        }
    };



    return (
        <ProductContext.Provider value={{ products, getAllProducts, loading, error }}>
            {children}
        </ProductContext.Provider>
    );
};

export { ProductContext, ProductProvider, useProducts };
