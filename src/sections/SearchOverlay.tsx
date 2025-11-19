"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const popularSearches = [
  "New Arrivals",
  "Summer Collection",
  "Sale Items",
  "Best Sellers",
  "Trending Now",
];

const recentSearches = [
  "Sneakers",
  "T-Shirts",
  "Jeans",
];

const searchSuggestions = [
  "Men's Clothing",
  "Women's Dresses",
  "Accessories",
  "Shoes",
  "Bags",
];

export default function SearchOverlay({
  isOpen,
  onClose,
  onSearch,
}: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input when overlay opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setShowSuggestions(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    onClose();
  };

  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Search Overlay */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
            }}
            className="fixed top-0 left-0 right-0 bg-white z-[101] shadow-2xl"
            onFocus={() => setShowSuggestions(true)}
            onBlur={(e) => {
              // Don't hide if clicking inside the overlay
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setTimeout(() => setShowSuggestions(false), 200);
              }
            }}
          >
            <div className="page-width py-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Search className="w-6 h-6 text-gray-600" />
                  <h2 className="text-2xl font-bold">Search</h2>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Search Input */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="relative mb-8"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    placeholder="Search for products, brands, and more..."
                    className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      type="submit"
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </motion.form>

              {/* Search Suggestions / Results */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                  >
                    {/* Search Suggestions */}
                    {searchQuery && filteredSuggestions.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                          Suggestions
                        </h3>
                        <div className="space-y-2">
                          {filteredSuggestions.map((suggestion, index) => (
                            <motion.button
                              key={suggestion}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                            >
                              <span className="text-gray-700">{suggestion}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Searches */}
                    {!searchQuery && recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Recent Searches
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search, index) => (
                            <motion.button
                              key={search}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => handleSuggestionClick(search)}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                            >
                              {search}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    {!searchQuery && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-gray-600" />
                          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Popular Searches
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {popularSearches.map((search, index) => (
                            <motion.button
                              key={search}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + index * 0.05 }}
                              onClick={() => handleSuggestionClick(search)}
                              className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between group"
                            >
                              <span className="text-gray-700">{search}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Results */}
                    {searchQuery && filteredSuggestions.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <p className="text-gray-500 mb-2">No results found</p>
                        <p className="text-sm text-gray-400">
                          Try searching for something else
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

