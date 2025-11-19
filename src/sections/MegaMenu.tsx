"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft, ArrowLeft, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./MegaMenu.module.css";
import { ShopifyProduct } from "@/lib/shopify";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  products: ShopifyProduct[];
  collections?: Array<{
    id: string;
    title: string;
    handle: string;
    image?: string;
  }>;
  isAnnouncementBarVisible?: boolean;
}

export default function MegaMenu({
  isOpen,
  onClose,
  products,
  collections = [],
  isAnnouncementBarVisible = true,
}: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Display first 12 products for Swiper
  const displayedProducts = products.slice(0, 12);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Sidebar - Full Width & Height */}
          <div className="lg:hidden fixed inset-0 z-[70]">
            {/* Sidebar - Full Width */}
            <motion.div
              ref={menuRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              className="absolute left-0 top-0 bottom-0 w-full h-full bg-white overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-[#F8F5F0]">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">Back</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-900" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Collections Section */}
                {collections.length > 0 && (
                  <div className="px-4 py-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                      Collections
                    </h3>
                    <ul className="space-y-2">
                      {collections.map((collection, index) => (
                        <motion.li
                          key={collection.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={`/collections/${collection.handle}`}
                            onClick={onClose}
                            className="flex items-center justify-between py-3 text-sm text-gray-700 hover:text-black transition-colors group border-b border-gray-100 last:border-0"
                          >
                            <span>{collection.title}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Products Section - Swiper */}
                <div className="px-4 py-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Featured Products
                    </h3>
                    <Link
                      href="/shop"
                      onClick={onClose}
                      className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-1"
                    >
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="relative">
                    <Swiper
                      modules={[Navigation, Autoplay]}
                      spaceBetween={16}
                      slidesPerView={1.2}
                      slidesPerGroup={1}
                      navigation={{
                        nextEl: ".mega-menu-mobile-swiper-next",
                        prevEl: ".mega-menu-mobile-swiper-prev",
                      }}
                      autoplay={{
                        delay: 4000,
                        pauseOnMouseEnter: true,
                        disableOnInteraction: false,
                      }}
                      breakpoints={{
                        375: {
                          slidesPerView: 1.5,
                          slidesPerGroup: 1,
                        },
                        480: {
                          slidesPerView: 2,
                          slidesPerGroup: 2,
                        },
                      }}
                      className="mega-menu-mobile-products-swiper"
                    >
                      {displayedProducts.map((product) => {
                        const hasImage = product.images?.edges && product.images.edges.length > 0;
                        const imageUrl = hasImage
                          ? product.images.edges[0].node.url
                          : null;
                        const price = parseFloat(
                          product.priceRange.minVariantPrice.amount
                        );
                        const currency =
                          product.priceRange.minVariantPrice.currencyCode;

                        return (
                          <SwiperSlide key={product.id}>
                            <Link
                              href={`/products/${product.handle}`}
                              onClick={onClose}
                              className="block group"
                            >
                              <div className="relative aspect-square mb-3 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                                {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={product.images.edges[0]?.node.altText || product.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    sizes="(max-width: 480px) 50vw, 33vw"
                                  />
                                ) : (
                                  <div className="text-gray-400 text-xs text-center px-4">
                                    {product.title}
                                  </div>
                                )}
                              </div>
                              <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-black transition-colors">
                                {product.title}
                              </h4>
                              <p className="text-sm font-semibold text-black">
                                {currency} {price.toFixed(2)}
                              </p>
                            </Link>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>

                    {/* Navigation Buttons - Mobile */}
                    <button
                      className="mega-menu-mobile-swiper-prev absolute left-0 top-[35%] -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all -ml-2"
                      aria-label="Previous products"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      className="mega-menu-mobile-swiper-next absolute right-0 top-[35%] -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all -mr-2"
                      aria-label="Next products"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop Mega Menu */}
          <div 
            className="hidden lg:block fixed left-0 right-0 z-[60] flex justify-center items-start px-4 md:px-5"
            style={{
              top: isAnnouncementBarVisible ? "130px" : "90px",
            }}
          >
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="w-full max-w-[1200px] mx-auto shadow-2xl border border-gray-200 rounded-2xl overflow-hidden"
              style={{ 
                maxHeight: "calc(100vh - 150px)",
                backgroundColor: "#F8F5F0"
              }}
            >
              <div className="w-full overflow-y-auto" style={{ maxHeight: "calc(100vh - 150px)" }}>
                <div className="px-4 md:px-10 py-6 md:py-8">
                  {/* Desktop Layout */}
                  <div className="grid grid-cols-4 gap-8">
                    {/* Collections Section - Desktop */}
                    {collections.length > 0 && (
                      <div className="col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                          Collections
                        </h3>
                        <ul className="space-y-2">
                          {collections.map((collection, index) => (
                            <motion.li
                              key={collection.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={`/collections/${collection.handle}`}
                                onClick={onClose}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors group"
                              >
                                <span>{collection.title}</span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Products Grid - Desktop */}
                    <div className={collections.length > 0 ? "col-span-3" : "col-span-4"}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Featured Products
                        </h3>
                        <Link
                          href="/shop"
                          onClick={onClose}
                          className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-1 group"
                        >
                          View All
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                      {/* Desktop Swiper */}
                      <div className="relative">
                        <Swiper
                          modules={[Navigation, Autoplay]}
                          spaceBetween={20}
                          slidesPerView={4}
                          slidesPerGroup={4}
                          navigation={{
                            nextEl: ".mega-menu-desktop-swiper-next",
                            prevEl: ".mega-menu-desktop-swiper-prev",
                          }}
                          autoplay={{
                            delay: 5000,
                            pauseOnMouseEnter: true,
                            disableOnInteraction: false,
                          }}
                          className="mega-menu-desktop-swiper"
                        >
                          {displayedProducts.map((product) => {
                            const hasImage = product.images?.edges && product.images.edges.length > 0;
                            const imageUrl = hasImage
                              ? product.images.edges[0].node.url
                              : null;
                            const price = parseFloat(
                              product.priceRange.minVariantPrice.amount
                            );
                            const currency =
                              product.priceRange.minVariantPrice.currencyCode;

                            return (
                              <SwiperSlide key={product.id}>
                                <Link
                                  href={`/products/${product.handle}`}
                                  onClick={onClose}
                                  className="block group/item"
                                >
                                  <div className="relative aspect-square mb-3 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                                    {imageUrl ? (
                                      <Image
                                        src={imageUrl}
                                        alt={product.images.edges[0]?.node.altText || product.title}
                                        fill
                                        className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                                        sizes="(max-width: 1024px) 25vw, 20vw"
                                      />
                                    ) : (
                                      <div className="text-gray-400 text-xs text-center px-4">
                                        {product.title}
                                      </div>
                                    )}
                                  </div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover/item:text-black transition-colors">
                                    {product.title}
                                  </h4>
                                  <p className="text-sm font-semibold text-black">
                                    {currency} {price.toFixed(2)}
                                  </p>
                                </Link>
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>

                        {/* Desktop Navigation Buttons */}
                        <button
                          className="mega-menu-desktop-swiper-prev absolute left-0 top-[35%] -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all -ml-5"
                          aria-label="Previous products"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          className="mega-menu-desktop-swiper-next absolute right-0 top-[35%] -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all -mr-5"
                          aria-label="Next products"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

