import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const images = [
  {
    url: "https://images.unsplash.com/photo-1615803796379-b4cda8e9c09c?w=1200&auto=format&fit=crop&q=80",
    title: "Experience Serenity",
    description: "Discover breathtaking landscapes and tranquil moments."
  },
  {
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=80",
    title: "Unforgettable Adventures",
    description: "Embark on journeys beyond imagination."
  },
  {
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80",
    title: "Luxury & Comfort",
    description: "Indulge in the finest experiences."
  },
  {
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop&q=80",
    title: "Nature’s Beauty – Inspired Comfort",
    description: "A perfect blend of elegance and nature, our sofa design brings the warmth of earthy tones and organic textures into your living space."
  },
  {
    url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&auto=format&fit=crop&q=80",
    title: "Timeless Elegance",
    description: "Step into a world of style and sophistication."
  }
];

const Carousel = () => {
  return (
    <div className="w-full relative">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        effect="fade"
        modules={[Autoplay, EffectFade]}
        className="rounded-lg shadow-lg"
      >
        {images.map((item, index) => (
          <SwiperSlide key={index} className="relative">
            <div className="relative w-full h-[600px]">
              <img
                src={item.url}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 rounded-lg"></div>
              <div className="absolute bottom-16 left-8 text-white">
                <h2 className="text-4xl font-bold drop-shadow-md animate-fade-in">{item.title}</h2>
                <p className="text-lg mt-2 drop-shadow-sm animate-fade-in delay-200">
                  {item.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
