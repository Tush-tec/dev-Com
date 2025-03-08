import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const SecondCarousel = () => {
  const slides = [
    { id: 1, image: "https://images.unsplash.com/photo-1680503397107-475907e4f3e3?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Elegant Sofas for Every Home" },
    { id: 2, image: "https://images.unsplash.com/photo-1604580040660-f0a7f9abaea6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Comfortable Beds for Sweet Dreams" },
    { id: 3, image: "https://images.unsplash.com/photo-1729603369774-23019dbf6c9c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Stylish Dining Sets for Family Feasts" },
  ];

  return (
    <div className="container mx-auto my-10 px-4">
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-center mb-6">
        Because One Couch is Never Enough
      </h2>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-base md:text-lg lg:text-xl font-semibold px-4 text-center">
              {slide.title}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SecondCarousel;
