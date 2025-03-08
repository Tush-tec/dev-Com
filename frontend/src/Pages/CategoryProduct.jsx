import React, { useEffect, useState } from "react";
import { LocalStorage, requestHandler } from "../Utils/app";
import { fetchProductForParticularCategory } from "../Api/api";
import { Link, useParams } from "react-router-dom";
import { addToCart } from "../Utils/Store/CartSlice";
import Loader from "../Components/Loader";
import Footer from "../Components/Footer";
import HeaderPage from "../Components/HeaderPage";
import Cart from "../Components/Cart";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";

const CategoryProduct = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [showCart, setShowCart] = useState(false);

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
                            Price: <span className="font-bold">&#8377;{product.price.toLocaleString("en-IN")}</span>
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
            <button
              onClick={() => setShowCart(!showCart)}
              className="fixed bottom-6 right-6 bg-[#898989] text-white p-3 rounded-full shadow-lg z-50 flex items-center"
            >
              <ShoppingCartIcon className="w-8 h-8" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Cart Sidebar */}
            <div
  className={`fixed inset-y-0 right-0 w-80 bg-gray-100 shadow-lg transform transition-transform ${
    showCart ? "translate-x-0" : "translate-x-full"
  } p-4 border-l border-gray-300 z-40 h-full overflow-y-auto`} // Added h-full and overflow-y-auto
>
  <button
    onClick={() => setShowCart(false)}
    className="absolute top-2 right-2"
  >
    <XMarkIcon className="w-6 h-6 text-gray-600" />
  </button>
  <Cart />
  {cartItems.length > 0 && (
    <button className="mt-4 w-full bg-[#292928] hover:bg-[#363539] text-white py-2 rounded text-lg font-semibold">
      <Link to="/checkout">Proceed to Checkout</Link>
    </button>
  )}
</div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CategoryProduct;
