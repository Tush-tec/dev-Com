  import React, { useEffect, useState, useCallback } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useProducts } from "../Utils/ProductContext";
  import Loader from "./Loader";
  import { ShoppingCartIcon } from "@heroicons/react/24/outline";
  import { LocalStorage } from "../Utils/app";
  import { addToCart, removeCartItem } from "../Utils/Store/CartSlice";
  import Cart from "./Cart";
  import { Link, useNavigate } from "react-router-dom";

  const Products = () => {
    const { products, getAllProducts, loading, error } = useProducts();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cartItems);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedQuantities, setSelectedQuantities] = useState({});

    const navigate =  useNavigate()

    useEffect(() => {
      getAllProducts(page).then((response) => {
        if (response?.data?.hasMore === false) {
          setHasMore(false);
        }
      });
    }, [page]);
    
    const loadMoreProducts = useCallback(() => {
      if (loading || !hasMore) return;
      setPage((prevPage) => prevPage + 1);
    }, [loading, hasMore]);
    
    useEffect(() => {
      const handleScroll = () => {
        if (
          window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 10
        ) {
          loadMoreProducts();
        }
      };
    
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
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
      });y
    };

    const handleAddToCart = (product) => {
      const quantity = selectedQuantities[product._id] || 1; 
      dispatch(
        addToCart({
          owner: token,
          productId: product._id,
          quantity,
        })
      );
      setSelectedQuantities((prev) => ({ ...prev, [product._id]: 0 }));
    };

    return (
      <div className="flex" >
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">Product List</h1>

          {loading && <Loader />}
          {error && <p className="text-red-500">{error.message}</p>}

          {products.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(( product) => {
                const count = selectedQuantities[product._id] || 0;

                return (
                  <div
                    key={product._id}
                    className=" h-[440px] bg-white"
                  >
                    <img
                      src={product.mainImage.replace(
                        "/upload/",
                        "/upload/w_500,h_500,c_fill/"
                      )}
                      alt={product.name}
                      className="w-100vh h-100vh object-cover rounded-t-lg"
                    />
                    <div className="p-4 text-center">
                      <h3 className="text-lg  font-semibold">{product.name}</h3>
                      <p className="text-xl font-bold mt-2">&#8377;{product.price.toLocaleString('en-IN') }</p>
                    </div>
                    <div className="flex items-center justify-between p-2">
                    <div className="flex items-center justify-center space-x-3 mt-2">
                      <button
                        onClick={() => handleDecreaseQuantity(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-full"
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
                        className="bg-gray-500 text-white p-2 rounded-full  space-x-2"
                      >
                        <ShoppingCartIcon className="w-10 h-5" />
                        
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

        <div className="w-80 p-4 bg-gray-100 border-l border-gray-300 shadow-lg">
          <Cart />
          {cart.length > 0 && (
            <button
            className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-md text-lg font-semibold" >
              <Link
              to="/checkout">Proceed to Checkout  </Link>

          </button>
          )}
        </div>
      </div>
    );
  };

  export default Products;
