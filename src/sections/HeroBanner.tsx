"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Image from "next/image";
import { Button } from "@/snippets";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./HeroBanner.module.css";

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "Elevate Your Style",
    subtitle: "New Collection 2024",
    description: "Discover premium quality fashion that defines elegance and sophistication",
    buttonText: "Shop Now",
    buttonLink: "/shop",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "Summer Essentials",
    subtitle: "Limited Edition",
    description: "Stay cool and stylish with our curated summer collection",
    buttonText: "Explore",
    buttonLink: "/collections/summer",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "Premium Quality",
    subtitle: "Crafted with Care",
    description: "Experience the difference of premium quality in every detail",
    buttonText: "Learn More",
    buttonLink: "/about",
  },
];

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [heroHeight, setHeroHeight] = useState<string>("calc(100vh - 200px)");
  const [isMounted, setIsMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true); // Start with true for immediate animations
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Only enable parallax on client and after mount for performance
  // Always call hooks in the same order - never conditionally
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect for background - always call useTransform (Rules of Hooks)
  const yTransform = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Set mounted flag after component mounts to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
    // Enable animations immediately for smooth page load experience
    setShouldAnimate(true);
  }, []);

  // Calculate hero height dynamically
  useEffect(() => {
    const calculateHeight = () => {
      const announcementBar = document.querySelector('[data-announcement-bar]') as HTMLElement;
      const header = document.querySelector('header') as HTMLElement;
      
      let totalHeight = 40; // Hero margin (20px top + 20px bottom)
      
      if (announcementBar) {
        const announcementHeight = announcementBar.offsetHeight + 20; // height + top margin
        totalHeight += announcementHeight;
      }
      
      if (header) {
        const headerHeight = header.offsetHeight + 20; // height + bottom margin
        totalHeight += headerHeight;
      }
      
      const calculatedHeight = `calc(100vh - ${totalHeight}px)`;
      setHeroHeight(calculatedHeight);
    };

    // Calculate on mount and resize
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    
    // Also calculate after a short delay to ensure elements are rendered
    const timeout = setTimeout(calculateHeight, 100);
    
    // Recalculate when announcement bar visibility might change
    const observer = new MutationObserver(calculateHeight);
    const announcementBar = document.querySelector('[data-announcement-bar]');
    if (announcementBar) {
      observer.observe(announcementBar.parentElement || document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      window.removeEventListener('resize', calculateHeight);
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (swiperRef) {
      swiperRef.autoplay?.stop();
      if (isAutoplay) {
        swiperRef.autoplay?.start();
      }
    }
  }, [isAutoplay, swiperRef]);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay);
  };

  const currentSlide = heroSlides[activeIndex];

  return (
    <motion.section
      ref={containerRef}
      initial={shouldAnimate ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldAnimate ? { duration: 0.6, delay: 0.3, ease: "easeOut" } : { duration: 0 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        margin: "0 20px 20px 20px",
        height: heroHeight,
        minHeight: "500px",
      }}
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={isMounted ? { y: yTransform } : {}}
        className="absolute inset-0 z-0"
      >
        <Swiper
          onSwiper={setSwiperRef}
          modules={[EffectFade, Autoplay, Pagination, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop={true}
          autoplay={isAutoplay ? { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
          onSlideChange={handleSlideChange}
          speed={800}
          watchSlidesProgress={true}
          className={styles.heroSwiper}
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={slide.id} className={styles.heroSlide}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  quality={75}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
                {/* Animated Gradient Overlay - Only animate after mount */}
                {isMounted && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "linear",
                    }}
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16">
        <div className="max-w-4xl w-full text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Subtitle */}
              <motion.p
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldAnimate ? { delay: 0.1, duration: 0.5 } : { duration: 0 }}
                className="text-sm sm:text-base md:text-lg font-medium text-white/90 uppercase tracking-widest"
              >
                {currentSlide.subtitle}
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldAnimate ? { delay: 0.2, duration: 0.5 } : { duration: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                style={{
                  textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                {currentSlide.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldAnimate ? { delay: 0.3, duration: 0.5 } : { duration: 0 }}
                className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
              >
                {currentSlide.description}
              </motion.p>

              {/* Button */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldAnimate ? { delay: 0.4, duration: 0.5 } : { duration: 0 }}
                className="pt-4"
              >
                <Button href={currentSlide.buttonLink} className="inline-block">
                  {currentSlide.buttonText}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => swiperRef?.slidePrev()}
        className={`${styles.navButton} ${styles.navButtonLeft}`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
      <button
        onClick={() => swiperRef?.slideNext()}
        className={`${styles.navButton} ${styles.navButtonRight}`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Custom Pagination */}
      <div className={styles.paginationContainer}>
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperRef?.slideTo(index)}
            className={`${styles.paginationDot} ${activeIndex === index ? styles.paginationDotActive : ""}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <motion.div
          className={styles.progressBar}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          key={activeIndex}
          transition={{ duration: 5, ease: "linear" }}
        />
      </div>

      {/* Autoplay Toggle */}
      <motion.button
        onClick={toggleAutoplay}
        className={styles.autoplayButton}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isAutoplay ? "Pause autoplay" : "Play autoplay"}
      >
        {isAutoplay ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </motion.button>

      {/* Floating Elements Animation - Reduced count for performance, only after mount */}
      {isMounted && shouldAnimate && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => {
            // Use fixed values based on index to prevent hydration mismatch
            const xPosition = ((i + 1) * 30) % 100;
            const duration = 3 + (i % 2) * 1;
            const delay = i * 0.5;
            
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/15 rounded-full"
                initial={{
                  x: `${xPosition}%`,
                  y: "100%",
                  opacity: 0,
                }}
                animate={{
                  y: "-10%",
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: "linear",
                }}
              />
            );
          })}
        </div>
      )}
    </motion.section>
  );
}

