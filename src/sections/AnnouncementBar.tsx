"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import styles from "./AnnouncementBar.module.css";

const announcementTexts = [
  "🎉 Free shipping on orders over $50! Use code SAVE10 for 10% off",
  "🚀 New arrivals just dropped! Shop the latest collection now",
  "✨ Limited time offer: Buy 2 Get 1 Free on selected items",
];

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      data-announcement-bar
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-black text-white py-2.5 px-4 relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
        }}
      />

      {/* Close button - top right */}
      <motion.button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-4 z-20 p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Close announcement"
      >
        <X className="w-4 h-4" />
      </motion.button>

      <div className="page-width relative z-10">
        <div className={styles.announcementSwiperWrapper}>
          <Swiper
            modules={[EffectCoverflow, Autoplay]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 0,
              modifier: 1,
              slideShadows: false,
            }}
            className={styles.announcementSwiper}
          >
            {[...announcementTexts, ...announcementTexts, ...announcementTexts].map(
              (text, index) => (
                <SwiperSlide key={index} className={styles.announcementSwiperSlide}>
                  <p className="text-xs sm:text-sm font-medium text-center">
                    {text}
                  </p>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      </div>
    </motion.div>
  );
}
