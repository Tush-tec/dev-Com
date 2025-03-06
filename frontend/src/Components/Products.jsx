import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProducts } from "../Utils/ProductContext";
import Loader from "./Loader";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LocalStorage } from "../Utils/app";
import { addToCart } from "../Utils/Store/CartSlice";
import Cart from "./Cart";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Products = () => {
  const { products, getAllProducts, loading, error, hasMore } = useProducts();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems);
  const [page, setPage] = useState(1);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [showCart, setShowCart] = useState(false); // State to show/hide Cart

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
      <div className="flex flex-col md:flex-row">
        {/* Product List */}
        <div className="flex-1 p-4">
          {loading && <Loader />}
          {error && <p className="text-red-500">{error.message}</p>}

          {products.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const count = selectedQuantities[product._id] || 0;

                return (
                  <div key={product._id} className=" shadow-md rounded-lg p-4">
<Link to={`/product/${product._id}`} className="block">
<img
    src={product.mainImage.replace("/upload/", "/upload/w_600,h_750,c_fill/")}
    alt={product.name}
    className="w-full h-64 object-cover rounded"
  />
</Link>
                    <div className="p-4 flex flex-col text-center">
                      <h3 className="text-lg font-serif">{product.name}</h3>
                      <p className="text-gray-700">
                        Price: <span className="font-bold">&#8377;{product.price.toLocaleString("en-IN")}</span>
                      </p>
                    </div>

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
                        <ShoppingCartIcon className="w-10 h-5" />
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

          {loading && <Loader />}
          {!hasMore && <p className="text-2xl font-semibold text-gray-800 font-serif">
        No more products… unless you were expecting a secret stash? 
      </p>}
        </div>

        {/* Cart (Hidden on Small Screens, Visible on Large Screens) */}
        <div className={`fixed inset-y-0 right-0 w-80 bg-gray-100 shadow-lg transform transition-transform ${
          showCart ? "translate-x-0" : "translate-x-full"
        } md:relative md:translate-x-0 md:w-80 p-4 border-l border-gray-300`}>
          {/* Close Button for Mobile */}
          <button onClick={() => setShowCart(false)} className="md:hidden absolute top-2 right-2">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>

          <Cart />
          {cart.length > 0 && (
            <button className="mt-4 w-full bg-[#a9a99b] hover:bg-[#363539] text-white py-2 rounded text-lg font-semibold">
              <Link to="/checkout">Proceed to Checkout</Link>
            </button>
          )}
        </div>
      </div>

      {/* Floating Cart Button for Mobile */}
      <button
        onClick={() => setShowCart(!showCart)}
        className="md:hidden fixed bottom-4 right-4 	bg-[#898989] text-white p-3 rounded-full shadow-lg"
      >
        <ShoppingCartIcon className="w-8 h-8" />
        {cart.length > 0 && <span className="absolute top-0 right-0 bg-[#f5f5f5] text-black text-xs px-2 py-1 rounded-full">{cart.length}</span>}
      </button>

    </>
  );
};

export default Products;
