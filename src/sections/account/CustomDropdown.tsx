"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Search } from "lucide-react";

interface CustomDropdownProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  searchable?: boolean;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  required = false,
  searchable = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Calculate position before opening
  const calculatePosition = () => {
    if (!dropdownRef.current) return "bottom";
    
    const rect = dropdownRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 240; // max-h-60 = 240px
    
    // Find the closest scrollable parent (modal) - check multiple conditions
    let parent = dropdownRef.current.parentElement;
    let modalElement: HTMLElement | null = null;
    let checkDepth = 0;
    const maxDepth = 10; // Prevent infinite loop
    
    while (parent && checkDepth < maxDepth) {
      const style = getComputedStyle(parent);
      if (
        parent.classList.contains("overflow-y-auto") || 
        style.overflowY === "auto" ||
        style.overflowY === "scroll" ||
        parent.classList.contains("max-h-") ||
        (parent.style.maxHeight && parent.style.maxHeight !== "none")
      ) {
        modalElement = parent;
        break;
      }
      parent = parent.parentElement;
      checkDepth++;
    }

    // Check space within modal if it exists
    if (modalElement) {
      const modalRect = modalElement.getBoundingClientRect();
      const spaceBelowInModal = modalRect.bottom - rect.bottom;
      const spaceAboveInModal = rect.top - modalRect.top;
      
      // Add some padding (20px) to ensure dropdown doesn't touch edges
      if (spaceBelowInModal < dropdownHeight + 20 && spaceAboveInModal > spaceBelowInModal) {
        return "top";
      }
    }
    
    // Fallback to window-based positioning
    if (spaceBelow < dropdownHeight + 20 && spaceAbove > spaceBelow) {
      return "top";
    }
    
    return "bottom";
  };

  // Filter options based on search query
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Update position when dropdown opens (for dynamic updates)
  useEffect(() => {
    if (isOpen) {
      const newPosition = calculatePosition();
      setPosition(newPosition);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus search input when dropdown opens (if searchable)
      if (searchable && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, searchable]);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => {
          if (!isOpen) {
            // Calculate position before opening to prevent flash
            const newPosition = calculatePosition();
            setPosition(newPosition);
          }
          setIsOpen(!isOpen);
        }}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all flex items-center justify-between bg-white hover:border-gray-400"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-10"
            />
            <motion.div
              ref={dropdownMenuRef}
              initial={{ opacity: 0, y: position === "top" ? 10 : -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: position === "top" ? 10 : -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden ${
                position === "top" ? "bottom-full mb-2" : "top-full mt-2"
              }`}
              style={{ 
                maxHeight: "240px",
                // Ensure dropdown doesn't overflow modal
                maxWidth: "100%",
              }}
            >
              {/* Search Input (if searchable) */}
              {searchable && (
                <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="max-h-60 overflow-y-auto overflow-x-hidden">
                {filteredOptions.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No results found
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    value === option.value ? "bg-gray-50" : ""
                  }`}
                >
                  <span className={value === option.value ? "font-medium text-gray-900" : "text-gray-700"}>
                    {option.label}
                  </span>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-5 h-5 text-black" />
                    </motion.div>
                  )}
                </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

