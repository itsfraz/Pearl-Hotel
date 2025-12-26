import React, { useEffect } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const Slideshow = () => {
  // Array of image URLs for the slideshow
  const images = [
    "./images/slider/hotel1.jpg",
    "./images/slider/hotel2.jpg",
    "./images/slider/hotel3.jpg",
    "./images/slider/hotel4.jpg",
  ];

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
        {/* Custom Navigation Arrows */}
        <div className="swiper-button-next !text-white !bg-transparent hover:!bg-opacity-10 !p-4 !rounded-full"></div>
        <div className="swiper-button-prev !text-white !bg-transparent hover:!bg-opacity-10 !p-4 !rounded-full"></div>
      </Swiper>
    </div>
  );
};

export default Slideshow;
