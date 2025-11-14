import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Judge Sarah Mitchell',
    role: 'High Court Judge',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    quote: 'This platform has revolutionized how we manage cases. The efficiency and transparency it brings is remarkable.',
  },
  {
    name: 'Advocate Rajesh Kumar',
    role: 'Senior Lawyer',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
    quote: 'Access to case information in real-time has transformed my practice. Highly recommended for legal professionals.',
  },
  {
    name: 'Inspector Priya Sharma',
    role: 'Police Department',
    img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=400&auto=format&fit=crop',
    quote: 'Evidence submission and case tracking is now seamless. A game-changer for law enforcement agencies.',
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Court Registrar',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    quote: 'The administrative workflows are incredibly efficient. Managing court schedules has never been easier.',
  },
  {
    name: 'Citizen Aisha Patel',
    role: 'Public User',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    quote: 'Finally, a transparent system where I can track my case status without hassle. Truly empowering for citizens.',
  }
];

export default function GalleryCarousel() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Professionals
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what legal professionals and citizens are saying about our platform
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay, EffectCoverflow, Pagination]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-12"
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, idx) => (
            <SwiperSlide key={idx} className="max-w-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 h-full border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-red-100"
                  />
                  <div className="ml-4">
                    <h4 className="font-bold text-lg text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
