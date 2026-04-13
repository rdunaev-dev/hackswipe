"use client";

import { motion, AnimatePresence } from "framer-motion";

interface VaultCounterProps {
  count: number;
  onClick: () => void;
}

export default function VaultCounter({ count, onClick }: VaultCounterProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl glass hover:bg-white/10 active:scale-95 transition-all"
    >
      <span className="text-lg">🏦</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={count}
          className="text-sm font-bold text-vault-gold font-mono min-w-[1.2rem] text-center"
          initial={{ y: -12, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 12, opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
