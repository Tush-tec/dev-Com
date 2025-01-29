import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; 
import "swiper/css"; 

const images = [
  "https://images.unsplash.com/photo-1615803796379-b4cda8e9c09c?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=60"
];

const Carousel = () => {
  return (
    <div className=" w-full">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true} 
        className="rounded-lg shadow-lg"
        modules={[Autoplay]}
      >
        {images.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              src={item}
              alt={`Slide ${index + 1}`}
              className="w-full h-[600px] object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
