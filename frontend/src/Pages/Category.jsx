import React, { useEffect, useState, useRef } from "react";
import { requestHandler } from "../Utils/app";
import { fetchCategory } from "../Api/api";
import Loader from "../Components/Loader";
import { Link } from "react-router-dom";

const Category = () => {
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const categoriesData = async () => {
            await requestHandler(
                fetchCategory,
                setLoading,
                (data) => {
                    console.log("Categories Loaded:", data.data.categories);
                    setCategories(data.data.categories);
                },
                (err) => {
                    console.log("Error Occurred:", err);
                    setError(err);
                }
            );
        };
        categoriesData();
    }, []);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            {/* Section Title */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Explore the collections</h2>
                <button className="flex items-center gap-2 text-gray-700 hover:text-black transition duration-300">
                    View all <span className="text-lg">→</span>
                </button>
            </div>

            {/* Categories List */}
            {loading ? (
                <Loader />
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : categories && categories.length > 0 ? (
                <div className="relative flex items-center mt-6 group">
                    {/* Left Scroll Button (Hidden by default, appears on hover) */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 z-10 bg-gray-200 p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-300"
                    >
                        ◀
                    </button>

                    {/* Scrollable Categories */}
                    <div
                        ref={scrollRef}
                        className="overflow-x-auto whitespace-nowrap py-4 no-scrollbar w-full transition-all duration-300"
                    >
                        <ul className="flex space-x-6">
                            {categories.map((category) => (
                                
                                <Link 
                                    to={`/categories/get-product-with-category/${category._id}`}
                                    key={category._id}
                                    className="bg-gray-100 px-6 py-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-gray-200 text-center min-w-[150px] flex flex-col items-center shadow-sm hover:shadow-md"
                                >
                                    <img
                                        src={category.image}
                                        alt={category.categoryName}
                                        className="w-20 h-20 object-contain mb-2 transition-transform duration-300 hover:scale-110"
                                    />
                                   <span className="font-medium text-center w-full truncate max-w-[140px] line-clamp-2">{category.categoryName}</span>
                                </Link>
                            ))}
                        </ul>
                    </div>

                    {/* Right Scroll Button (Hidden by default, appears on hover) */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 z-10 bg-gray-200 p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-300"
                    >
                        ▶
                    </button>
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-6">No category found</div>
            )}
        </div>
    );
};

export default Category;
