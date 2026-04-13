"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiceRarity } from "@/lib/types";
import { RARITY_COLORS, RARITY_LABELS } from "@/lib/balancer";

interface DiceRollProps {
  roll: number;
  rarity: DiceRarity;
  onComplete: () => void;
}

export default function DiceRoll({ roll, rarity, onComplete }: DiceRollProps) {
  const [phase, setPhase] = useState<"spinning" | "reveal">("spinning");
  const colors = RARITY_COLORS[rarity];
  const label = RARITY_LABELS[rarity];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 350);
    const t2 = setTimeout(() => onComplete(), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {phase === "spinning" && (
          <motion.div
            key="spin"
            className="relative"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 720 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div
              className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg ${colors.glow} shadow-2xl`}
            >
              <motion.span
                className="text-white font-mono text-3xl font-bold"
                animate={{ opacity: [1, 0.3, 1, 0.3, 1] }}
                transition={{ duration: 0.35 }}
              >
                d100
              </motion.span>
            </div>

            {/* Orbit particles */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${colors.bg}`}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0.8,
                }}
                animate={{
                  x: Math.cos((i * Math.PI) / 3) * 60,
                  y: Math.sin((i * Math.PI) / 3) * 60,
                  opacity: 0,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ top: "50%", left: "50%", marginTop: -4, marginLeft: -4 }}
              />
            ))}
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            className="flex flex-col items-center gap-2"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <div
              className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg ${colors.glow} shadow-2xl ring-2 ring-white/20`}
            >
              <span className={`font-mono text-5xl font-black ${colors.text}`}>
                {roll}
              </span>
            </div>
            {label && (
              <motion.span
                className={`text-sm font-bold ${colors.text} mt-1`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {label}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
