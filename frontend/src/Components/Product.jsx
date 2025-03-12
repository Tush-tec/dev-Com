import React, { useEffect, useState, useCallback } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { useProducts } from "../Utils/ProductContext";
import Loader from "./Loader";
import { LocalStorage } from "../Utils/app";
import { addToCart } from "../Utils/Store/CartSlice";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import HeaderPage from "./HeaderPage";
import { useAuth } from "../Utils/AuthContext";

const Product = () => {
  const { products, getAllProducts, loading, error, hasMore } = useProducts();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const {isAuthenticated} = useAuth()


  

  useEffect(() => {
    getAllProducts({ page });
  }, [page]);

  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;
    setPage((prevPage) => prevPage + 1);
  }, [loading, hasMore, getAllProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100) {
        loadMoreProducts();
      }
    };

    let debounceTimer;
    const optimizedScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleScroll, 300);
    };

    window.addEventListener("scroll", optimizedScroll);
    return () => window.removeEventListener("scroll", optimizedScroll);
  }, [loadMoreProducts]);

  const token = LocalStorage.get("Token");

  const handleIncreaseQuantity = (productId) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleDecreaseQuantity = (productId) => {
    setSelectedQuantities((prev) => {
      if (!prev[productId] || prev[productId] <= 1) return prev;
      return {
        ...prev,
        [productId]: prev[productId] - 1,
      };
    });
  };

  const handleAddToCart = async (product) => {
    const quantity = selectedQuantities[product._id] || 1;
    await dispatch(
      addToCart({
        owner: token,
        productId: product._id,
        quantity,
      })
    );

    setSelectedQuantities((prev) => ({ ...prev, [product._id]: 0 }));
  };

  return (
    <>

    <HeaderPage/>
    {isAuthenticated ? 
  
  <>
  {/* True Section */}
  

      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-4">
          {loading && <Loader />}
          {error && <p className="text-red-500">{error.message}</p>}

          {products.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const count = selectedQuantities[product._id] || 0;

                return (
                  <div key={product._id} className="shadow-md rounded-lg p-4">
                    <Link to={`/product/${product._id}`} className="block">
                      <img
                        src={product.mainImage.replace("/upload/", "/upload/w_600,h_750,c_fill/")}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded"
                      />
                      <div className="p-4 flex flex-col text-center">
                        <h3 className="text-lg font-serif">{product.name}</h3>
                        <p className="text-gray-700">
                          Price: <span className="font-bold">&#8377;{product.price.toLocaleString("en-IN")}</span>
                        </p>
                      </div>
                    </Link>

                    <div className="p-2">
                      <div className="flex items-center justify-center space-x-3 mt-1">
                        <button
                          onClick={() => handleDecreaseQuantity(product._id)}
                          className="bg-gray-500 text-white px-3 py-1 rounded-full"
                          disabled={count <= 0}
                        >
                          -
                        </button>
                        <span className="text-xl font-bold">{count}</span>
                        <button
                          onClick={() => handleIncreaseQuantity(product._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-full"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-red-400 text-white p-2 flex items-center justify-center w-full rounded-full mt-5"
                      >
                        Move to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    
  
  </> : 

  <>
{/* False Section */}


    <section className="container flex items-center justify-center h-screen mx-auto bg-gradient-to-l from-[#162130] to-[#737982]">
            <div className="w-full max-w-md p-8 bg-white text-center shadow-2xl rounded-2xl border border-gray-300">
              <h2 className="text-3xl font-bold text-[#162130] mb-4">
                Access Required
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Please log in to place an order and enjoy seamless shopping!
              </p>
              <div className="flex justify-center">
                <Link to="/login">
                  <button className="bg-[#162130] hover:bg-[#1E293B] text-white py-2 px-5 rounded-full transition-transform transform hover:scale-105 shadow-md">
                    Redirect to Login
                  </button>
                </Link>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#162130] hover:text-[#1E293B] font-semibold hover:underline"
                >
                  Sign up here
                </Link>
                .
              </div>
            </div>
          </section>
  </>
  
  }

  <Footer/>
      
    </>
  );
};

export default Product;
