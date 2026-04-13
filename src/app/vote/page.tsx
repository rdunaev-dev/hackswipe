"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/types";
import { generateCoverSvg } from "@/lib/covers";

export default function VotePageWrapper() {
  return (
    <Suspense fallback={null}>
      <VotePage />
    </Suspense>
  );
}

function VotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [honorable, setHonorable] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const bankIdParam = searchParams.get("bank") ?? "";

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    fetch("/api/projects")
      .then((r) => r.json())
      .then((p) => setAllProjects(p));
  }, [authLoading, isAuthenticated, router]);

  const bankProjects = useMemo(() => {
    if (!bankIdParam || allProjects.length === 0) return [];
    const ids = bankIdParam.split(",");
    return ids.map((id) => allProjects.find((p) => p.id === id)).filter((p): p is Project => !!p);
  }, [bankIdParam, allProjects]);

  function toggleHonorable(id: string) {
    if (id === selected) return;
    setHonorable((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winnerId: selected,
          honorableIds: honorable,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 409) {
          router.push("/done");
          return;
        }
        setError(data.error || "Failed to submit vote");
        setSubmitting(false);
        return;
      }

      router.push("/done");
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  if (authLoading || allProjects.length === 0) return null;

  if (bankProjects.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Банк пуст</p>
          <button onClick={() => router.push("/bank")} className="text-dice-cyan text-sm">
            ← Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <button
          onClick={() => router.push("/bank")}
          className="text-sm text-slate-500 hover:text-slate-400 mb-2 flex items-center gap-1"
        >
          ← Назад в банк
        </button>
        <h1 className="text-xl font-bold text-white mb-1">Финальный выбор</h1>
        <p className="text-sm text-slate-500">
          Выбери <span className="text-vault-gold font-medium">1 победителя</span>{" "}
          и до <span className="text-slate-400">2 упоминаний</span> (необязательно)
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        {bankProjects.map((project, i) => {
          const isWinner = selected === project.id;
          const isHonorable = honorable.includes(project.id);
          const projectIndex = allProjects.findIndex((p) => p.id === project.id);
          const coverSvg = generateCoverSvg(Math.max(0, projectIndex), project.title);
          const coverUri = `data:image/svg+xml,${encodeURIComponent(coverSvg)}`;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="mb-3"
            >
              <div
                className={`relative p-3 rounded-2xl border transition-all cursor-pointer ${
                  isWinner
                    ? "border-vault-gold bg-vault-gold/10 shadow-lg shadow-vault-gold/10"
                    : isHonorable
                      ? "border-cyan-500/40 bg-cyan-500/5"
                      : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={coverUri} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{project.title}</h3>
                    <p className="text-xs text-slate-500 truncate">{project.oneLiner}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setSelected(project.id);
                      setHonorable((h) => h.filter((x) => x !== project.id));
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isWinner
                        ? "bg-vault-gold text-black"
                        : "bg-white/5 text-slate-400 hover:bg-vault-gold/20 hover:text-vault-gold"
                    }`}
                  >
                    {isWinner ? "★ Победитель" : "Выбрать победителем"}
                  </button>
                  <button
                    onClick={() => toggleHonorable(project.id)}
                    disabled={isWinner}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      isHonorable
                        ? "bg-cyan-500/20 text-cyan-400"
                        : isWinner
                          ? "bg-white/5 text-slate-600 cursor-not-allowed"
                          : "bg-white/5 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400"
                    }`}
                  >
                    {isHonorable ? "✓ Mention" : "Mention"}
                  </button>
                </div>

                {isWinner && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-vault-gold flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <span className="text-black text-xs font-bold">★</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="px-5 pb-5 safe-bottom">
        {error && <p className="text-xs text-accent-red text-center mb-2">{error}</p>}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl font-bold text-black bg-gradient-to-r from-vault-gold to-yellow-400 active:scale-[0.97] transition-all disabled:opacity-50"
                whileTap={{ scale: 0.97 }}
              >
                {submitting ? "Отправляем..." : "Отправить голос"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        {!selected && (
          <p className="text-center text-xs text-slate-600 py-3">
            Выбери одного победителя, чтобы продолжить
          </p>
        )}
      </div>
    </div>
  );
}
