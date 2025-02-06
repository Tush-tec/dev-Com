import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProducts } from "../Utils/ProductContext";
import Loader from "./Loader";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { LocalStorage } from "../Utils/app";
import { addToCart } from "../Utils/Store/CartSlice";

const Products = () => {
  const { products, getAllProducts, loading, error } = useProducts();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getAllProducts(page);
  }, [page]);

  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;
    setPage((prevPage) => prevPage + 1);
  }, [loading, hasMore]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    loadMoreProducts();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const token = LocalStorage.get("Token");

  const handleAddToCart = (product) => {
    // Check if the product is already in the cart and get its current quantity
    // const existingProduct = cart.find((item) => item._id === product._id);
    // const updatedQuantity = existingProduct ? existingProduct.quantity + 1 : 1;

    // Dispatch addToCart with the correct data
    dispatch(
      addToCart({
        owner: token,
        productId: product._id,
        quantity
      })
    );
  };

  return (
    <div className="flex">
      {/* Product Section */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4">Product List</h1>

        {loading && <Loader />}
        {error && <p className="text-red-500">{error.message}</p>}

        {products.length !== 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const existingProduct = cart.find(
                (item) => item._id === product._id
              );
              const count = existingProduct ? existingProduct.quantity : 0;

              return (
                <div
                  key={product._id}
                  className="max-w-[290px] h-[500px] bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={product.mainImage.replace(
                      "/upload/",
                      "/upload/w_400,h_200,c_fill/"
                    )}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-xl font-bold mt-2">
                      &#8377;{product.price}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-500 text-white p-2 rounded-full flex items-center space-x-2"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Add to Cart</span>
                      {count >  0 &&  (
                      <div className="text-xl text-gray-600">
                        In Cart
                      </div>
                    )}
                    </button>
                    
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No products found</p>
        )}

        {loading && <Loader />}
        {!hasMore && <p>No more products available</p>}
      </div>

      {/* Cart Sidebar */}
      {/* <div className="w-80 p-4 bg-gray-100 border-l border-gray-300 shadow-lg">
        <Cart />
      </div> */}
    </div>
  );
};

export default Products;
