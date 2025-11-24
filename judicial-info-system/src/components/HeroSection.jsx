/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion"; // motion actually used below
import "swiper/css";

export default function HeroSection() {
  const navigate = useNavigate();
  const slides = [
    "/courtroom.jpg",
    "/lawbooks.jpg",
    "/justice.jpg"
  ];

  return (
    <section className="relative">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop
        autoplay={{ delay: 3000 }}
      >
        {slides.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-[80vh] bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            >
              <div className="bg-black/50 h-full flex items-center justify-center">
                <motion.h2
                  className="text-white text-3xl md:text-5xl font-serif font-bold text-center px-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Empowering Transparency and Justice through Technology
                </motion.h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-6 w-full px-4 flex justify-center">
        <button
          onClick={() => navigate('/signup')}
          className="bg-judicialRed w-full max-w-xs md:max-w-md text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-800 transition shadow-lg"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
