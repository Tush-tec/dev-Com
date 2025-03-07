import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchIndividualProduct } from "../Api/api";
import { requestHandler } from "../Utils/app";
import Loader from "../Components/Loader";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";
import { addToCart } from "../Utils/Store/CartSlice";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); 
  const [cartHave, setCartHave]= useState(false)



  useEffect(() => {
    const fetchProduct = async () => {
      await requestHandler(
        () => fetchIndividualProduct(productId),
        setLoading,
        (response) => setProduct(response.data),
        (errorMessage) => setError(errorMessage)
      );
    };
    fetchProduct();
  }, [productId]);


  const token = localStorage.getItem("Token");


  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };


  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };


  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login first!");
      return;
    }

    await dispatch(
      addToCart({
        userId: token, 
        productId,
        quantity,
      })
    );

    alert("Product added to cart! go for checkOut");
    setCartHave(true)
  };


  const handleBuyNow = async () => {
    await handleAddToCart();
    setTimeout(() => {
      window.location.href = "/checkout"; 
    }, 100);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <HeaderPage />
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-6">

        <div className="flex flex-col items-center">
          <img
            src={product.mainImage.replace("/upload/", "/upload/w_600,h_650,c_fill/")}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-2xl font-semibold mt-2 text-gray-800">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <p className="text-green-600 mt-1">In Stock: {product.stock.toLocaleString("en-IN")}</p>


          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={handleDecreaseQuantity}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md"
              disabled={quantity === 1}
            >
              −
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={handleIncreaseQuantity}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>


          <div className="mt-6 flex space-x-4">
            <button
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
          {
            cartHave && 
            <button 
            className="px-6 py-3 bg-yellow-300 text-black rounded-lg hover:bg-yellow-600 mt-5" 
            onClick={handleBuyNow}
            >
                Ah, a person of culture! Proceed to checkout
            </button>
          }
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
