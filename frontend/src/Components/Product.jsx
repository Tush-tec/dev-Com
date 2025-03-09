import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useProducts } from "../Utils/ProductContext";
import Loader from "./Loader";
import { LocalStorage } from "../Utils/app";
import { addToCart } from "../Utils/Store/CartSlice";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import HeaderPage from "./HeaderPage";

const Product = () => {
  const { products, getAllProducts, loading, error, hasMore } = useProducts();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [selectedQuantities, setSelectedQuantities] = useState({});

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
      <HeaderPage />
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
      <Footer />
    </>
  );
};

export default Product;
