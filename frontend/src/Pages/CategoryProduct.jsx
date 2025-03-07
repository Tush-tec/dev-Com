import React, { useEffect, useState } from 'react';
import { requestHandler } from '../Utils/app';
import { fetchProductForParticularCategory } from '../Api/api';
import { Link, useParams } from 'react-router-dom';
import Loader from '../Components/Loader';
import Footer from '../Components/Footer';
import HeaderPage from '../Components/HeaderPage';

const CategoryProduct = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!categoryId) return;

        const fetchWithId = async () => {
            setLoading(true);
            try {
                await requestHandler(
                    () => fetchProductForParticularCategory(categoryId),
                    setLoading,
                    (data) => {
                        console.log("API Response:", data);
                        setProducts(data?.data || []);
                    },
                    setError
                );
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products.");
                setLoading(false);
            }
        };

        fetchWithId();
    }, [categoryId]);

    return (
        <>
        <HeaderPage/>
        <div className="p-4 mt-8 mb-8">
            {loading && <Loader />}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && products.length === 0 && <p>No products found.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {

                    const optimizedImage = product.mainImage.replace("/upload/", "/upload/w_300,q_60/");
                    
                    return (
                        <div key={product._id} className="border p-4 rounded-lg shadow-md">
                            <Link to={`/product/${product._id}`}>
                                <img
                                    src={optimizedImage} 
                                    alt={product.name} 
                                    className="w-full h-40 object-cover mb-2 rounded-md"
                                    loading="lazy" 
                                />
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-gray-600">Price: ₹{product.price}</p>
                                <p className="text-gray-500">Stock: {product.stock}</p>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default CategoryProduct;
