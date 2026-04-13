"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/feed")
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "completed") {
          router.push("/done");
        } else {
          router.push("/swipe");
        }
      })
      .catch(() => router.push("/swipe"));
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSubmitting(true);

    const result = await login(email.trim());
    if (result.ok) {
      router.push("/swipe");
    } else {
      setError(result.error || "Login failed");
      setSubmitting(false);
    }
  }

  const loading = isLoading;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 safe-bottom">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-dice-cyan/5 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-sm w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-dice-cyan/20 to-dice-blue/20 border border-dice-cyan/20 flex items-center justify-center mb-8"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-4xl">🎲</span>
        </motion.div>

        <h1 className="text-3xl font-black text-white mb-2 leading-tight">
          Hack<span className="text-gradient-cyan">Swipe</span>
        </h1>

        <p className="text-base text-slate-400 mb-2">
          Приз зрительских симпатий
        </p>

        <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-4" />

        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          Свайпай <span className="text-accent-green font-medium">вправо</span>{" "}
          — проект попадает в Финальный банк.{" "}
          Свайпай <span className="text-accent-red font-medium">влево</span>{" "}
          — пропуск. В конце выбери одного победителя.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.name@rantsports.com"
            disabled={loading || submitting}
            className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-dice-cyan/50 focus:bg-white/[0.07] transition-all disabled:opacity-50"
            autoComplete="email"
            autoFocus
          />

          {error && (
            <p className="text-xs text-accent-red">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading || submitting || !email.trim()}
            className="w-full py-3.5 rounded-2xl font-bold text-black bg-gradient-to-r from-dice-cyan to-dice-blue text-sm active:scale-[0.97] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
            whileTap={{ scale: 0.97 }}
          >
            {loading || submitting ? (
              <div className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
            ) : (
              "Начать"
            )}
          </motion.button>
        </form>

        <p className="text-[11px] text-slate-600 mt-4">
          Один email = один голос. Нельзя голосовать за свой проект.
        </p>
      </motion.div>
    </div>
  );
}
