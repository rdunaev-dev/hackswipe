"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export default function DonePage() {
  const router = useRouter();
  const { email, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 safe-bottom text-center">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-5%",
              backgroundColor: ["#F5A623", "#00F0FF", "#FF3D71", "#00E676", "#a78bfa"][i % 5],
            }}
            animate={{ y: "110vh", rotate: Math.random() * 720, opacity: [1, 1, 0] }}
            transition={{
              duration: 3 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeIn",
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🎉
        </motion.div>

        <h1 className="text-2xl font-black text-white mb-2">Голос принят!</h1>
        <p className="text-sm text-slate-400 mb-8">
          Спасибо, {email}
        </p>

        <div className="glass rounded-2xl p-4 max-w-xs mx-auto mb-6">
          <p className="text-xs text-slate-500 leading-relaxed">
            Результаты будут объявлены после закрытия голосования.
            Каждый голос одинаково важен.
          </p>
        </div>

        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          Выйти из аккаунта
        </button>
      </motion.div>
    </div>
  );
}
