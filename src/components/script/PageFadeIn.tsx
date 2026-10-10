"use client";

import { motion } from "framer-motion";

/** Fade/slide nhe luc noi dung trang chi tiet kich ban xuat hien, cho cam giac chuyen trang mượt hon. */
export function PageFadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
