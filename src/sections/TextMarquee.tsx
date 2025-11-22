"use client";

import { motion } from "framer-motion";
import { Sparkles, Star, Zap, Gift, Shield, Heart, Award, TrendingUp } from "lucide-react";

const marqueeItems = [
  { text: "Free Shipping Worldwide", icon: Zap },
  { text: "Premium Quality Guaranteed", icon: Star },
  { text: "24/7 Customer Support", icon: Sparkles },
  { text: "30-Day Return Policy", icon: Gift },
  { text: "Secure Payment Options", icon: Shield },
  { text: "Exclusive Member Benefits", icon: Heart },
  { text: "New Arrivals Every Week", icon: Award },
  { text: "Limited Edition Collections", icon: TrendingUp },
];

export default function TextMarquee() {
  // Create items with dots between them (not after each)
  const createItemsWithSeparators = (setIndex: number) => {
    return marqueeItems.flatMap((item, index) => {
      const Icon = item.icon;
      const uniqueKey = `set-${setIndex}-item-${index}`;
      const dotKey = `set-${setIndex}-dot-${index}`;
      
      const itemElement = (
        <div key={uniqueKey} className="flex items-center gap-3 px-8 flex-shrink-0">
          <div className="flex-shrink-0">
            <Icon className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
          </div>
          <span className="text-white font-semibold text-sm md:text-base tracking-wide uppercase whitespace-nowrap">
            {item.text}
          </span>
        </div>
      );
      
      // Add dot separator after each item except the last
      if (index < marqueeItems.length - 1) {
        return [
          itemElement,
          <motion.div
            key={dotKey}
            className="w-2 h-2 rounded-full bg-yellow-400/80 flex-shrink-0 mx-6"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: (setIndex * marqueeItems.length + index) * 0.15,
            }}
          />
        ];
      }
      return [itemElement];
    });
  };

  // Duplicate multiple times for seamless infinite scroll with unique keys
  const duplicatedContent = [
    ...createItemsWithSeparators(0),
    ...createItemsWithSeparators(1),
    ...createItemsWithSeparators(2),
  ];

  return (
    <div className="relative rounded-2xl ml-[20px] mr-[20px] overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-6 border-y border-gray-700/30">
      {/* Animated shimmer overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none z-20"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "linear",
        }}
      />

      {/* Marquee Container - Seamless infinite scroll */}
      <div className="relative flex items-center overflow-hidden">
        <motion.div
          className="flex items-center whitespace-nowrap"
          style={{ willChange: "transform" }}
          animate={{
            x: ["0%", "-33.333%"], // Move by exactly one set (1/3 of total)
          }}
          transition={{
            repeat: Infinity,
            duration: 60, // Smooth, slow speed
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {duplicatedContent}
        </motion.div>
      </div>

      {/* Gradient fade on edges for smooth blend */}
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10" />
    </div>
  );
}

