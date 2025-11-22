"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu, X, ChevronDown, ChevronRight, ArrowLeft, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import MegaMenu from "./MegaMenu";
import AccountModal from "./AccountModal";
import { ShopifyProduct } from "@/lib/shopify";
import { useAuthStore } from "@/store/useAuthStore";

const navigationLinks = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "/about" },
  { name: "SHOP", href: "/shop" },
  { name: "CONTACT US", href: "/contact" },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnnouncementBarVisible, setIsAnnouncementBarVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openCart, getTotalItems } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const totalItems = getTotalItems();
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const shopButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Fetch products and collections from Shopify
  useEffect(() => {
    const fetchShopifyData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products with cache-busting to ensure fresh data
        console.log("🔄 Fetching products from API...");
        const productsRes = await fetch("/api/shopify/products?first=24", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        
        if (!productsRes.ok) {
          const errorText = await productsRes.text();
          console.error("❌ Products API request failed:", productsRes.status, productsRes.statusText, errorText);
          setProducts([]);
          setIsLoading(false);
          return;
        }
        
        const productsData = await productsRes.json();
        console.log("📦 Products API Response:", productsData);
        
        // Check for API errors
        if (productsData.error) {
          console.error("❌ Shopify Products API Error:", productsData.error, productsData.message, productsData.details);
          console.error("💡 Make sure NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN are set in Vercel");
          setProducts([]);
          setIsLoading(false);
          return;
        }
        
        // Handle both response structures: { products: {...} } or { data: { products: {...} } }
        const products = productsData.data?.products || productsData.products;
        if (products?.edges && products.edges.length > 0) {
          const productList = products.edges.map(
            (edge: any) => edge.node
          );
          setProducts(productList);
          console.log("✅ Products loaded:", productList.length);
        } else {
          console.warn("⚠️ No products found in response. Response structure:", productsData);
          setProducts([]);
        }

        // Fetch collections with cache-busting
        console.log("🔄 Fetching collections from API...");
        const collectionsRes = await fetch("/api/shopify/collections?first=10", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        
        if (!collectionsRes.ok) {
          const errorText = await collectionsRes.text();
          console.error("❌ Collections API request failed:", collectionsRes.status, collectionsRes.statusText, errorText);
          setCollections([]);
          setIsLoading(false);
          return;
        }
        
        const collectionsData = await collectionsRes.json();
        console.log("📦 Collections API Response:", collectionsData);
        
        // Check for API errors
        if (collectionsData.error) {
          console.error("❌ Shopify Collections API Error:", collectionsData.error, collectionsData.message, collectionsData.details);
          console.error("💡 Make sure NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN are set in Vercel");
          setCollections([]);
          setIsLoading(false);
          return;
        }
        
        // Handle both response structures
        const collections = collectionsData.data?.collections || collectionsData.collections;
        if (collections?.edges && collections.edges.length > 0) {
          const collectionList = collections.edges.map(
            (edge: any) => ({
              id: edge.node.id,
              title: edge.node.title,
              handle: edge.node.handle,
              image: edge.node.image?.url,
            })
          );
          setCollections(collectionList);
          console.log("✅ Collections loaded:", collectionList.length);
        } else {
          console.warn("⚠️ No collections found in response. Response structure:", collectionsData);
          setCollections([]);
        }

        // Fetch pages with cache-busting
        try {
          const pagesRes = await fetch("/api/shopify/pages?first=10", {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          const pagesData = await pagesRes.json();
          
          if (!pagesData.error) {
            const pages = pagesData.data?.pages || pagesData.pages;
            if (pages?.edges) {
              const pageList = pages.edges.map(
                (edge: any) => ({
                  id: edge.node.id,
                  title: edge.node.title,
                  handle: edge.node.handle,
                })
              );
              setPages(pageList);
              console.log("✅ Pages loaded:", pageList.length);
            }
          }
        } catch (error) {
          console.warn("⚠️ Pages not available:", error);
        }
      } catch (error) {
        console.error("❌ Error fetching Shopify data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopifyData();

    // Refresh data when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchShopifyData();
      }
    };

    // Refresh data periodically (every 5 minutes) as fallback
    const refreshInterval = setInterval(() => {
      fetchShopifyData();
    }, 5 * 60 * 1000); // 5 minutes

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMegaMenuOpen &&
        megaMenuRef.current &&
        shopButtonRef.current &&
        !megaMenuRef.current.contains(event.target as Node) &&
        !shopButtonRef.current.contains(event.target as Node)
      ) {
        setIsMegaMenuOpen(false);
      }
    };

    if (isMegaMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMegaMenuOpen]);

  // Check scroll position for sticky header spacing
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50); // Trigger after 50px scroll
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check if announcement bar is visible
  useEffect(() => {
    const checkAnnouncementBar = () => {
      const announcementBar = document.querySelector('[data-announcement-bar]');
      if (announcementBar) {
        const rect = announcementBar.getBoundingClientRect();
        // Check if announcement bar is visible and in viewport
        setIsAnnouncementBarVisible(rect.height > 0 && rect.top >= 0 && rect.bottom > 0);
      } else {
        setIsAnnouncementBarVisible(false);
      }
    };

    // Initial check
    checkAnnouncementBar();
    
    // Check on scroll
    window.addEventListener("scroll", checkAnnouncementBar, { passive: true });
    window.addEventListener("resize", checkAnnouncementBar, { passive: true });

    // Also check when announcement bar visibility changes (when user closes it)
    const observer = new MutationObserver(checkAnnouncementBar);
    const announcementBar = document.querySelector('[data-announcement-bar]');
    if (announcementBar) {
      observer.observe(announcementBar, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: true,
        subtree: true,
      });
    }

    // Check periodically to catch any changes
    const interval = setInterval(checkAnnouncementBar, 100);

    return () => {
      window.removeEventListener("scroll", checkAnnouncementBar);
      window.removeEventListener("resize", checkAnnouncementBar);
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Close mega menu when scrolling (desktop only)
  useEffect(() => {
    const handleScroll = () => {
      if (isMegaMenuOpen && window.innerWidth >= 1024) {
        setIsMegaMenuOpen(false);
      }
    };

    if (isMegaMenuOpen) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMegaMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (query: string) => {
    // Handle search logic here
    console.log("Searching for:", query);
    // You can navigate to search results page or filter products
  };

  return (
    <>
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        className="sticky z-50 border border-gray-200 rounded-2xl shadow-sm transition-all duration-300 ease-out" 
        style={{ 
          backgroundColor: "#F8F5F0",
          margin: "0 20px 20px 20px",
          padding: "0 20px",
          top: isScrolled ? "20px" : "0px",
        }}
      >
        <div className="w-full">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Navigation Links - Left (Desktop) */}
            <nav className="hidden md:flex items-center gap-8 flex-1">
              {navigationLinks.map((link) => {
                if (link.name === "SHOP") {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                    >
                      <button
                        ref={shopButtonRef}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMegaMenuOpen(!isMegaMenuOpen);
                        }}
                        className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-wide flex items-center gap-1"
                      >
                        {link.name}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors uppercase tracking-wide"
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Logo - Center */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-2xl md:text-3xl font-bold text-black"
                >
                  <svg width="150" height="120" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
 
                  <text x="50%" y="50" textAnchor="middle" dominantBaseline="middle"
                        fontFamily="Poppins, sans-serif" fontWeight="900" fontSize="60"
                        fill="url(#textGradient)">
                    HEX
                  </text>

                  <path d="M50 90 C100 110, 200 70, 250 95" stroke="#ff00ff" strokeWidth="4" fill="transparent" strokeLinecap="round" strokeLinejoin="round"/>

                  <defs>
                    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00ffff"/>
                      <stop offset="100%" stopColor="#ff00ff"/>
                    </linearGradient>
                  </defs>
                </svg>

                </motion.div>
              </Link>
            </div>

            {/* Search, Account, and Cart - Right */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              {/* Search */}
              <motion.button
                onClick={() => setIsSearchOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-900" />
              </motion.button>

              {/* Account */}
              {isAuthenticated && user ? (
                <Link href="/account">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Account"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  onClick={() => setIsAccountModalOpen(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 text-gray-900" />
                </motion.button>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-900" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Sidebar - Full Width & Height */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[80]">
            <motion.div
              ref={mobileMenuRef}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">Back</span>
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-900" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto">
                <nav className="flex flex-col py-4">
                  {navigationLinks.map((link) => {
                    if (link.name === "SHOP") {
                      return (
                        <button
                          key={link.href}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsMegaMenuOpen(true);
                          }}
                          className="px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors uppercase tracking-wide text-left flex items-center justify-between border-b border-gray-100"
                        >
                          {link.name}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors uppercase tracking-wide border-b border-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mega Menu - Outside header for proper positioning */}
      <div ref={megaMenuRef}>
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
          products={products}
          collections={collections}
          pages={pages}
          isAnnouncementBarVisible={isAnnouncementBarVisible}
          isScrolled={isScrolled}
        />
      </div>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
      <CartDrawer />
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
}

