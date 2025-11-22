"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
}

export default function CustomCheckbox({
  checked,
  onChange,
  label,
  id,
}: CustomCheckboxProps) {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
          checked
            ? "bg-black border-black"
            : "bg-white border-gray-300 hover:border-gray-400"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      <label
        htmlFor={id}
        onClick={() => onChange(!checked)}
        className="text-sm text-gray-700 cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );
}

