import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProducts } from "../Utils/ProductContext";
import Loader from "./Loader";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { LocalStorage } from "../Utils/app";
import { addToCart } from "../Utils/Store/CartSlice";
import { Link } from "react-router-dom";

const Products = () => {
  const { products, getAllProducts, loading, error } = useProducts();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  useEffect(() => {
    getAllProducts({ page: 1 });
  }, []);

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
        owner: LocalStorage.get("Token"),
        productId: product._id,
        quantity,
      })
    );

    setSelectedQuantities((prev) => ({ ...prev, [product._id]: 0 }));
  };

  return (
    <div className="p-4">
      {loading && <Loader />}
      {error && <p className="text-red-500">{error.message}</p>}

      {products.length !== 0 ? (
        <div className="overflow-x-auto whitespace-nowrap">
          <div className="flex space-x-6">
            {products.slice(0, 10).map((product) => {
              const count = selectedQuantities[product._id] || 0;
              return (
                <div
                  key={product._id}
                  className="shadow-md rounded-lg p-4 flex-shrink-0 w-72"
                >
                  <Link to={`/product/${product._id}`} className="block">
                    <img
                      src={product.mainImage.replace(
                        "/upload/",
                        "/upload/w_600,h_750,c_fill/"
                      )}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded"
                    />
                  </Link>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-serif">{product.name}</h3>
                    <p className="text-gray-700">
                      Price:{" "}
                      <span className="font-bold">
                        &#8377;{product.price.toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                  <div className="p-2 flex flex-col items-center">
                    <div className="flex items-center space-x-3">
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
                      className="bg-red-400 text-white p-2 w-full rounded-full mt-5 flex items-center justify-center"
                    >
                      <ShoppingCartIcon className="w-10 h-5" />
                      Move to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default Products;
