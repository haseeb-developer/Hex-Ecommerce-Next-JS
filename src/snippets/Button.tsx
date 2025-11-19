"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "./Button.module.css";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link href={href} className={`${styles.buttonLink} ${className}`}>
      <motion.button
        className={`${styles.button} ${styles[variant]}`}
        whileHover={{ boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
        whileTap={{ boxShadow: "0 5px 20px rgba(0,0,0,0.15)" }}
      >
        <span className={styles.buttonText}>{children}</span>
        <ArrowRight className={styles.buttonIcon} />
        <div className={styles.buttonReflection} />
      </motion.button>
    </Link>
  );
}

