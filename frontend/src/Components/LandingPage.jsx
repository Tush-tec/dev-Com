import React, { useEffect, useState } from "react";
import HeaderPage from "./HeaderPage";
import Carausel from "./Carausel";
import Products from "./Products";
import Category from "../Pages/Category";
import Footer from "./Footer";
import SecondCarousel from "./SecondCarausel";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { CheckBadgeIcon, TagIcon, TruckIcon } from "@heroicons/react/24/solid";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { LocalStorage } from "../Utils/app";
import { Link } from "react-router-dom";

const LandingPage = () => {

  const [isLoggin, setLoggin] = useState(false)

  useEffect(
    () =>{
      const  token  = LocalStorage.get("Token")

      if(token) setLoggin(true) 
    },[]
  )

  return (
    <div className="font-sans bg-gray-100">

      <HeaderPage />



      <section className="mt-8 mb-10">
        <Carausel />
      </section>


      {isLoggin === true ? 
        <>

        {/* Loggin true Section */}

        <section className="container bg-white mx-auto px-4 py-8 mt-10">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-6"
          style={{ fontFamily: "Merriweather, serif" }}
        >
          The Latest Excuse to Rearrange Your Living Room (Again)
        </h2>
        <Products />
      </section>


      <section className="bg-white py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
          Shop by Category
        </h2>
        <Category />
      </section>

      <section className="my-10">
        <SecondCarousel />
      </section>


      <section className="bg-white py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Why Choose Us?
        </h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">

          <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <CheckBadgeIcon className="mx-auto w-12 h-12 text-red-500" />
            <h3 className="text-lg font-semibold mt-2">Premium Quality</h3>
            <p className="text-gray-600">Crafted with top-notch materials.</p>
          </div>


          <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <TagIcon className="mx-auto w-12 h-12 text-green-500" />
            <h3 className="text-lg font-semibold mt-2">Affordable Prices</h3>
            <p className="text-gray-600">Luxury furniture at unbeatable prices.</p>
          </div>


          <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <TruckIcon className="mx-auto w-12 h-12 text-blue-500" />
            <h3 className="text-lg font-semibold mt-2">Fast & Free Delivery</h3>
            <p className="text-gray-600">Enjoy hassle-free doorstep delivery.</p>
          </div>
        </div>
      </section>


      <section className="bg-white py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          What Our Customers Say
        </h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="w-full max-w-3xl mx-auto px-4"
        >
          <SwiperSlide className="p-6 text-center bg-gray-100 rounded-lg shadow-md">
            <p className="text-lg md:text-xl italic">
              "Best furniture ever! My living room has never looked better."
            </p>
            <p className="mt-2 font-semibold">— Sarah K.</p>
          </SwiperSlide>
          <SwiperSlide className="p-6 text-center bg-gray-100 rounded-lg shadow-md">
            <p className="text-lg md:text-xl italic">
              "Affordable yet premium quality. Highly recommended!"
            </p>
            <p className="mt-2 font-semibold">— John D.</p>
          </SwiperSlide>
        </Swiper>
      </section>
        </> :

        <>

        {/* IsLoggin === false */}


        <section className="container flex items-center justify-center h-screen mx-auto bg-gradient-to-l from-[#162130] to-[#737982]">
  <div className="w-full max-w-md p-8 bg-white text-center shadow-2xl rounded-2xl border border-gray-300">
    <h2 className="text-3xl font-bold text-[#162130] mb-4">
      Access Required
    </h2>
    <p className="text-gray-600 mb-6 leading-relaxed">
      Please log in to place an order and enjoy seamless shopping!
    </p>
    <div className="flex justify-center">
      <Link to="/login">
        <button className="bg-[#162130] hover:bg-[#1E293B] text-white py-2 px-5 rounded-full transition-transform transform hover:scale-105 shadow-md">
          Redirect to Login
        </button>
      </Link>
    </div>
    <div className="mt-6 text-sm text-gray-500">
      Don't have an account?{" "}
      <Link to="/register" className="text-[#162130] hover:text-[#1E293B] font-semibold hover:underline">
        Sign up here
      </Link>.
    </div>
  </div>
</section>



            <section className="my-10">
        <SecondCarousel />
      </section>


      <section className="bg-white py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Why Choose Us?
        </h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">

          <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <CheckBadgeIcon className="mx-auto w-12 h-12 text-red-500" />
            <h3 className="text-lg font-semibold mt-2">Premium Quality</h3>
            <p className="text-gray-600">Crafted with top-notch materials.</p>
          </div>


          <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <TagIcon className="mx-auto w-12 h-12 text-green-500" />
            <h3 className="text-lg font-semibold mt-2">Affordable Prices</h3>
            <p className="text-gray-600">Luxury furniture at unbeatable prices.</p>
          </div>


          <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <TruckIcon className="mx-auto w-12 h-12 text-blue-500" />
            <h3 className="text-lg font-semibold mt-2">Fast & Free Delivery</h3>
            <p className="text-gray-600">Enjoy hassle-free doorstep delivery.</p>
          </div>
        </div>
      </section>


      <section className="bg-white py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          What Our Customers Say
        </h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="w-full max-w-3xl mx-auto px-4"
        >
          <SwiperSlide className="p-6 text-center bg-gray-100 rounded-lg shadow-md">
            <p className="text-lg md:text-xl italic">
              "Best furniture ever! My living room has never looked better."
            </p>
            <p className="mt-2 font-semibold">— Sarah K.</p>
          </SwiperSlide>
          <SwiperSlide className="p-6 text-center bg-gray-100 rounded-lg shadow-md">
            <p className="text-lg md:text-xl italic">
              "Affordable yet premium quality. Highly recommended!"
            </p>
            <p className="mt-2 font-semibold">— John D.</p>
          </SwiperSlide>
        </Swiper>
      </section>
        
        </>
      }


        


      <Footer />
    </div>
  );
};

export default LandingPage;
