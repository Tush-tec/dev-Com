import React, { useEffect, useState } from "react";
import { LocalStorage, requestHandler } from "../Utils/app";
import { fetchProductForParticularCategory } from "../Api/api";
import { Link, useParams } from "react-router-dom";
import { addToCart } from "../Utils/Store/CartSlice";
import Loader from "../Components/Loader";
import Footer from "../Components/Footer";
import HeaderPage from "../Components/HeaderPage";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCartIcon, } from "@heroicons/react/24/outline";

const CategoryProduct = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const dispatch = useDispatch();


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

  const token = LocalStorage.get("Token") || "";

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
    const quantity = selectedQuantities[product._id] || 0;
    await dispatch(
      addToCart({
        userId: token,
        productId: product._id,
        quantity,
      })
    );

    setSelectedQuantities((prev) => ({ ...prev, [product._id]: 0 }));
  };

  return (
    <>
      {/* Ensure Header Stays Visible */}
      <div className="relative z-50">
        <HeaderPage />
      </div>

      <div className="container relative">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-4">
            {loading && <Loader />}
            {error && <p className="text-red-500">{error}</p>}

            {products.length !== 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const count = selectedQuantities[product._id] || 0;

                  return (
                    <div key={product._id} className="shadow-md rounded-lg p-4">
                      <Link to={`/product/${product._id}`} className="block">
                        <img
                          src={product.mainImage.replace(
                            "/upload/",
                            "/upload/w_600,h_750,c_fill/"
                          )}
                          alt={product.name}
                          className="w-full h-64 object-cover rounded"
                        />
                        <div className="p-4 flex flex-col text-center">
                          <h3 className="text-lg font-serif">{product.name}</h3>
                          <p className="text-gray-700">
                            Price:{" "}
                            <span className="font-bold">
                              &#8377;{product.price.toLocaleString("en-IN")}
                            </span>
                          </p>
                        </div>
                      </Link>

                      <div className="p-2">
                        <div className="flex items-center justify-center space-x-3 mt-1">
                          <button
                            onClick={() => handleDecreaseQuantity(product._id)}
                            className="bg-gray-500 text-white px-3 py-1 rounded-full"
                            disabled={count <= 1}
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

            {/* Floating Cart Button */}

            {/* Cart Sidebar */}
         
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CategoryProduct;
