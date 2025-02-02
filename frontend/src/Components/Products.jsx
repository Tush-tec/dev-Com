import React, { useEffect, useState, useCallback } from 'react';
import { useProducts } from '../Utils/ProductContext';
import Loader from './Loader';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';  // Heroicons v2

const Products = () => {
  const { products, getAllProducts, loading, error } = useProducts();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Initial load
    getAllProducts(page);
  }, [page]);

  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;  // Prevent duplicate requests or when no more products are available
    setPage((prevPage) => prevPage + 1);
  }, [loading, hasMore]);

  // Handle scroll event
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    loadMoreProducts();
  };

  useEffect(() => {
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Product List</h1>

      {loading && <Loader />}
      {error && <p className="text-red-500">{error.message}</p>}

      {products.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="max-w-[290px] h-[350px] bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.mainImage.replace('/upload/','/upload/w_400,h_200,c_fill/')}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-xl font-bold mt-2">${product.price}</p>
              </div>
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setCount(count + 1)}
                  className="bg-blue-500 text-white p-2 rounded-full flex items-center space-x-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found</p>
      )}

      {loading && <Loader />} {/* Loader for when fetching more products */}
      {!hasMore && <p>No more products available</p>}
    </div>
  );
};

export default Products;
