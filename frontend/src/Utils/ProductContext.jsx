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
    const [hasMore, setHasMore] = useState(true); 

    const getAllProducts = async ({ page }) => {
        setLoading(true);
        setError(null);

        try {
            await requestHandler(
                async () => fetchProducts({page}), 
                setLoading,
                (res) => {
                    setProducts((prevProducts) => {
                        const newProducts = res.data.filter(
                            (newProduct) => !prevProducts.some((prev) => prev._id === newProduct._id)
                        );
                        return [...prevProducts, ...newProducts]; 
                    });
                    
                    if (res.data.length === 0) {
                        setHasMore(false); 
                    }
                }
            );
        } catch (error) {
            setError(error);
        }
    };

    return (
        <ProductContext.Provider value={{ products, getAllProducts, loading, error, hasMore }}>
            {children}
        </ProductContext.Provider>
    );
};


export { ProductContext, ProductProvider, useProducts };
