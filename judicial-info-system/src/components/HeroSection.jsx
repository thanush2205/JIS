import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion } from "framer-motion";
import { Scale, Shield, FileCheck } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1920&auto=format&fit=crop",
    title: "Digital Justice System",
    subtitle: "Modernizing legal processes with cutting-edge technology"
  },
  {
    img: "https://images.unsplash.com/photo-1555375771-14b2f1df2c01?q=80&w=1920&auto=format&fit=crop",
    title: "Transparent & Accessible",
    subtitle: "Making legal information accessible to everyone"
  },
  {
    img: "https://images.unsplash.com/photo-1505664063555-f0d839ce4d2e?q=80&w=1920&auto=format&fit=crop",
    title: "Secure & Reliable",
    subtitle: "Built with enterprise-grade security and reliability"
  }
];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        style={{ height: '90vh' }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-[90vh] bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              <div className="relative h-full flex items-center justify-center px-4">
                <div className="max-w-4xl text-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-gray-100 text-lg md:text-2xl mb-8"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex gap-4 justify-center flex-wrap"
                  >
                    <button 
                      onClick={() => navigate('/signup')}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      Get Started
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold border-2 border-white/30 transform hover:scale-105 transition-all duration-300"
                    >
                      Sign In
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Floating Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 hidden md:block"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 grid grid-cols-3 gap-6">
          <div className="text-center">
            <Scale className="w-10 h-10 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-gray-900">10K+</div>
            <div className="text-sm text-gray-600">Cases Managed</div>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <Shield className="w-10 h-10 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-gray-900">100%</div>
            <div className="text-sm text-gray-600">Secure & Private</div>
          </div>
          <div className="text-center">
            <FileCheck className="w-10 h-10 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-600">Always Available</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
