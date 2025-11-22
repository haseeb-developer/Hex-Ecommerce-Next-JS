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
  pages?: Array<{
    id: string;
    title: string;
    handle: string;
  }>;
  isAnnouncementBarVisible?: boolean;
  isScrolled?: boolean;
}

export default function MegaMenu({
  isOpen,
  onClose,
  products,
  collections = [],
  pages = [],
  isAnnouncementBarVisible = true,
  isScrolled = false,
}: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productCache, setProductCache] = useState<Record<string, ShopifyProduct[]>>({});
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Display first 24 products for Swiper (more for full-width display)
  const displayedProducts = activeCollection && collectionProducts.length > 0 
    ? collectionProducts.slice(0, 24)
    : products.slice(0, 24);

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

  // Reset active collection when menu closes
  useEffect(() => {
    if (!isOpen) {
      setActiveCollection(null);
      setCollectionProducts([]);
    }
  }, [isOpen]);

  // Fetch products for a collection
  const fetchCollectionProducts = async (collectionHandle: string) => {
    // Check cache first
    if (productCache[collectionHandle]) {
      setCollectionProducts(productCache[collectionHandle]);
      setActiveCollection(collectionHandle);
      return;
    }

    setIsLoadingProducts(true);
    try {
      const res = await fetch(`/api/shopify/collections/${collectionHandle}/products?first=24`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await res.json();
      
      if (data.error) {
        console.error("Error fetching collection products:", data.error);
        setCollectionProducts([]);
        return;
      }

      const collection = data.data?.collection || data.collection;
      if (collection?.products?.edges) {
        const productList = collection.products.edges.map((edge: any) => edge.node);
        setCollectionProducts(productList);
        setProductCache(prev => ({ ...prev, [collectionHandle]: productList }));
        setActiveCollection(collectionHandle);
        
        // Reset swiper to first slide
        if (swiperRef.current) {
          swiperRef.current.slideTo(0);
          setIsBeginning(true);
          setIsEnd(productList.length <= 5); // Adjust based on slidesPerView
        }
      } else {
        setCollectionProducts([]);
      }
    } catch (error) {
      console.error("Error fetching collection products:", error);
      setCollectionProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Handle collection click
  const handleCollectionClick = (collectionHandle: string, e: React.MouseEvent) => {
    e.preventDefault();
    fetchCollectionProducts(collectionHandle);
  };

  // Reset to all products
  const handleShowAllProducts = () => {
    setActiveCollection(null);
    setCollectionProducts([]);
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
      setIsBeginning(true);
      setIsEnd(products.length <= 5); // Adjust based on slidesPerView
    }
  };

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
                {/* Collections Section - Links Only */}
                {collections.length > 0 && (
                  <div className="px-4 py-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                      Collections
                    </h3>
                    <ul className="space-y-1">
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0 }}
                      >
                        <Link
                          href="/shop"
                          onClick={onClose}
                          className="flex items-center justify-between py-2.5 px-3 text-sm text-gray-700 hover:text-black transition-colors group border-b border-gray-100"
                        >
                          <span>All Products</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </motion.li>
                      {collections.map((collection, index) => (
                        <motion.li
                          key={collection.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index + 1) * 0.05 }}
                        >
                          <Link
                            href={`/collections/${collection.handle}`}
                            onClick={onClose}
                            className="flex items-center justify-between py-2.5 px-3 text-sm text-gray-700 hover:text-black transition-colors group border-b border-gray-100 last:border-0"
                          >
                            <span>{collection.title}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pages Section - Mobile */}
                {pages.length > 0 && (
                  <div className="px-4 py-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                      Pages
                    </h3>
                    <ul className="space-y-1">
                      {pages.map((page, index) => (
                        <motion.li
                          key={page.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={`/page/${page.handle}`}
                            onClick={onClose}
                            className="flex items-center justify-between py-2.5 px-3 text-sm text-gray-700 hover:text-black transition-colors group border-b border-gray-100 last:border-0"
                          >
                            <span>{page.title}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fallback Pages if no Shopify pages */}
                {pages.length === 0 && (
                  <div className="px-4 py-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                      Pages
                    </h3>
                    <ul className="space-y-1">
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0 }}
                      >
                        <Link
                          href="/page/faq"
                          onClick={onClose}
                          className="flex items-center justify-between py-2.5 px-3 text-sm text-gray-700 hover:text-black transition-colors group border-b border-gray-100"
                        >
                          <span>FAQ</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 }}
                      >
                        <Link
                          href="/page/shipping"
                          onClick={onClose}
                          className="flex items-center justify-between py-2.5 px-3 text-sm text-gray-700 hover:text-black transition-colors group border-b border-gray-100"
                        >
                          <span>Shipping</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Link
                          href="/page/returns"
                          onClick={onClose}
                          className="flex items-center justify-between py-2.5 px-3 text-sm text-gray-700 hover:text-black transition-colors group border-b border-gray-100"
                        >
                          <span>Returns</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <Link
                          href="/page/contact"
                          onClick={onClose}
                          className="flex items-center justify-between py-2.5 px-3 text-sm text-gray-700 hover:text-black transition-colors group border-b border-gray-100 last:border-0"
                        >
                          <span>Contact</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </motion.li>
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Desktop Mega Menu - Full Width */}
          <div 
            className="hidden lg:block fixed left-0 right-0 z-[60] px-5 transition-all duration-300 ease-out"
            style={{
              top: isAnnouncementBarVisible 
                ? (isScrolled ? "220px" : "190px")
                : (isScrolled ? "120px" : "80px"),
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
              className="w-full border border-gray-200 rounded-2xl overflow-hidden"
              style={{ 
                maxHeight: "calc(100vh - 200px)",
                backgroundColor: "#F8F5F0",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div className="w-full overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
                <div className="px-8 md:px-12 py-8 md:py-10">
                  {/* Desktop Layout - Advanced Grid with Tabs */}
                  <div className="grid grid-cols-12 gap-6">
                    {/* Collections Section - Left (Tabs) */}
                    {collections.length > 0 && (
                      <div className="col-span-2">
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-300">
                          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                            Collections
                          </h3>
                        </div>
                        <ul className="space-y-1">
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0 }}
                          >
                            <button
                              onClick={handleShowAllProducts}
                              className={`w-full text-left flex items-center gap-2 text-sm transition-all group py-2.5 px-3 rounded-lg ${
                                !activeCollection
                                  ? "bg-black text-white font-medium"
                                  : "text-gray-700 hover:text-black hover:bg-gray-100"
                              }`}
                            >
                              <span className={!activeCollection ? "" : "group-hover:translate-x-0.5 transition-transform"}>
                                All Products
                              </span>
                              {!activeCollection && (
                                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                              )}
                            </button>
                          </motion.li>
                          {collections.slice(0, 10).map((collection, index) => (
                            <motion.li
                              key={collection.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index + 1) * 0.02 }}
                            >
                              <button
                                onClick={(e) => handleCollectionClick(collection.handle, e)}
                                className={`w-full text-left flex items-center gap-2 text-sm transition-all group py-2.5 px-3 rounded-lg relative ${
                                  activeCollection === collection.handle
                                    ? "bg-black text-white font-medium"
                                    : "text-gray-700 hover:text-black hover:bg-gray-100"
                                }`}
                              >
                                <span className={activeCollection === collection.handle ? "" : "group-hover:translate-x-0.5 transition-transform"}>
                                  {collection.title}
                                </span>
                                {activeCollection === collection.handle && (
                                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                )}
                              </button>
                            </motion.li>
                          ))}
                        </ul>
                        {collections.length > 10 && (
                          <Link
                            href="/collections"
                            onClick={onClose}
                            className="mt-4 block text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1 group"
                          >
                            View All Collections
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Products Grid - Center - Always 5 products */}
                    <div className={collections.length > 0 && pages.length > 0 ? "col-span-5" : collections.length > 0 ? "col-span-7" : pages.length > 0 ? "col-span-7" : "col-span-12"}>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                            {activeCollection 
                              ? collections.find(c => c.handle === activeCollection)?.title || "Products"
                              : "Featured Products"
                            }
                          </h3>
                          <p className="text-xs text-gray-500">
                            {activeCollection 
                              ? `Browse ${collections.find(c => c.handle === activeCollection)?.title} collection`
                              : "Discover our best sellers"
                            }
                          </p>
                        </div>
                        <Link
                          href={activeCollection ? `/collections/${activeCollection}` : "/shop"}
                          onClick={onClose}
                          className="text-xs font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1 group px-4 py-2 border border-gray-300 rounded-lg hover:border-black hover:bg-white"
                        >
                          {activeCollection ? "View Collection" : "View All Products"}
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                      {/* Desktop Swiper */}
                      <div className="relative group" style={{ minHeight: "400px", width: "100%" }}>
                        {isLoadingProducts ? (
                          <div className="flex items-center justify-center absolute inset-0">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-[3px] border-gray-300 border-t-black rounded-full animate-spin" />
                              <p className="text-xs text-gray-500">Loading products...</p>
                            </div>
                          </div>
                        ) : displayedProducts.length === 0 ? (
                          <div className="flex items-center justify-center absolute inset-0">
                            <p className="text-sm text-gray-500">No products found in this collection</p>
                          </div>
                        ) : (
                          <Swiper
                            onSwiper={(swiper) => {
                              swiperRef.current = swiper;
                              setIsBeginning(swiper.isBeginning);
                              setIsEnd(swiper.isEnd);
                            }}
                            onSlideChange={(swiper) => {
                              setIsBeginning(swiper.isBeginning);
                              setIsEnd(swiper.isEnd);
                            }}
                            modules={[Navigation, Autoplay]}
                            spaceBetween={16}
                            breakpoints={{
                              640: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                                spaceBetween: 16,
                              },
                              768: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                                spaceBetween: 20,
                              },
                              1024: {
                                slidesPerView: 5,
                                slidesPerGroup: 5,
                                spaceBetween: 20,
                              },
                            }}
                            slidesPerView={2}
                            slidesPerGroup={2}
                            navigation={{
                              nextEl: ".mega-menu-desktop-swiper-next",
                              prevEl: ".mega-menu-desktop-swiper-prev",
                            }}
                            autoplay={!activeCollection ? {
                              delay: 5000,
                              pauseOnMouseEnter: true,
                              disableOnInteraction: false,
                            } : false}
                            key={activeCollection || "all"}
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
                        )}

                        {/* Desktop Navigation Buttons */}
                        <button
                          className={`mega-menu-desktop-swiper-prev absolute left-0 top-[25%] -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all -ml-5 ${
                            isBeginning
                              ? "bg-gray-100 cursor-not-allowed opacity-50"
                              : "bg-white hover:bg-gray-50 cursor-pointer opacity-100"
                          }`}
                          aria-label="Previous products"
                          disabled={isBeginning}
                          onClick={() => {
                            if (!isBeginning && swiperRef.current) {
                              swiperRef.current.slidePrev();
                            }
                          }}
                        >
                          <ChevronLeft className={`w-5 h-5 ${isBeginning ? "text-gray-400" : "text-gray-700"}`} />
                        </button>
                        <button
                          className={`mega-menu-desktop-swiper-next absolute right-0 top-[25%] -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all -mr-5 ${
                            isEnd
                              ? "bg-gray-100 cursor-not-allowed opacity-50"
                              : "bg-white hover:bg-gray-50 cursor-pointer opacity-100"
                          }`}
                          aria-label="Next products"
                          disabled={isEnd}
                          onClick={() => {
                            if (!isEnd && swiperRef.current) {
                              swiperRef.current.slideNext();
                            }
                          }}
                        >
                          <ChevronRight className={`w-5 h-5 ${isEnd ? "text-gray-400" : "text-gray-700"}`} />
                        </button>
                      </div>
                    </div>

                    {/* Pages Section - Right */}
                    <div className="col-span-2">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-300">
                        Pages
                      </h3>
                      {pages.length > 0 ? (
                        <ul className="space-y-3">
                          {pages.slice(0, 8).map((page, index) => (
                            <motion.li
                              key={page.id}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              <Link
                                href={`/page/${page.handle}`}
                                onClick={onClose}
                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-all group py-1.5"
                              >
                                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                                <span className="group-hover:translate-x-1 transition-transform">{page.title}</span>
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <div className="space-y-3">
                          <Link
                            href="/page/faq"
                            onClick={onClose}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-all group py-1.5"
                          >
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                            <span className="group-hover:translate-x-1 transition-transform">FAQ</span>
                          </Link>
                          <Link
                            href="/page/shipping"
                            onClick={onClose}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-all group py-1.5"
                          >
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                            <span className="group-hover:translate-x-1 transition-transform">Shipping</span>
                          </Link>
                          <Link
                            href="/page/returns"
                            onClick={onClose}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-all group py-1.5"
                          >
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                            <span className="group-hover:translate-x-1 transition-transform">Returns</span>
                          </Link>
                          <Link
                            href="/page/contact"
                            onClick={onClose}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-all group py-1.5"
                          >
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                            <span className="group-hover:translate-x-1 transition-transform">Contact</span>
                          </Link>
                        </div>
                      )}
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

